import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getVideos, getVideoById, getMemberByUserId, logVideoAccess } from "./db";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  videos: router({
    /**
     * Get all videos (public and private)
     * Private videos require membership
     */
    list: publicProcedure.query(async ({ ctx }) => {
      const allVideos = await getVideos();
      
      // If user is authenticated, check membership
      if (ctx.user) {
        const member = await getMemberByUserId(ctx.user.id);
        return allVideos.map(video => ({
          ...video,
          canAccess: !video.isPrivate || (member && member.isActive),
        }));
      }
      
      // Unauthenticated users can only see public videos
      return allVideos
        .filter(v => !v.isPrivate)
        .map(video => ({
          ...video,
          canAccess: true,
        }));
    }),

    /**
     * Get a single video by ID
     * Logs access attempt and checks membership
     */
    getById: publicProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ ctx, input }) => {
        const video = await getVideoById(input.videoId);
        
        if (!video) {
          throw new Error("Video not found");
        }

        // Check access permissions
        let canAccess = !video.isPrivate;
        
        if (video.isPrivate && ctx.user) {
          const member = await getMemberByUserId(ctx.user.id);
          canAccess = member ? member.isActive === 1 : false;
        }

        // Log access attempt
        if (ctx.user) {
          await logVideoAccess(
            ctx.user.id,
            input.videoId,
            ctx.req.headers["user-agent"] as string,
            ctx.req.headers["x-forwarded-for"] as string,
            canAccess
          );
        }

        if (!canAccess) {
          throw new Error("Access denied: membership required");
        }

        return video;
      }),
  }),

  members: router({
    /**
     * Get current user's membership status
     */
    me: protectedProcedure.query(async ({ ctx }) => {
      return await getMemberByUserId(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
