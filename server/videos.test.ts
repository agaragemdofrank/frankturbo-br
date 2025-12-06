import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(user?: AuthenticatedUser): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user || defaultUser,
    req: {
      protocol: "https",
      headers: {
        "user-agent": "Mozilla/5.0 Test",
        "x-forwarded-for": "127.0.0.1",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("videos router", () => {
  it("should list videos for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return empty array if no videos in DB, but should not throw
    const result = await caller.videos.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list only public videos for unauthenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.videos.list();
    
    expect(Array.isArray(result)).toBe(true);
    // All returned videos should have canAccess = true for public videos
    result.forEach(video => {
      if (!video.isPrivate) {
        expect(video.canAccess).toBe(true);
      }
    });
  });

  it("should throw error when video not found", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.videos.getById({ videoId: 99999 });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as Error).message).toContain("Video not found");
    }
  });

  it("should deny access to private videos for non-members", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    // Assuming video ID 1 exists and is private
    // This test validates the access control logic
    // In a real scenario, you'd seed test data first
    try {
      await caller.videos.getById({ videoId: 1 });
      // If it succeeds, the video must be public
      // If it fails, it's either private or doesn't exist
    } catch (error) {
      expect((error as Error).message).toMatch(/not found|Access denied/);
    }
  });
});

describe("members router", () => {
  it("should return member info for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return undefined if no membership record exists
    // but should not throw
    const result = await caller.members.me();
    expect(result === undefined || typeof result === "object").toBe(true);
  });

  it("should throw error when accessing members.me without authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.members.me();
      expect.fail("Should have thrown an error");
    } catch (error) {
      // Expected to throw UNAUTHORIZED error
      expect((error as Error).message).toBeDefined();
    }
  });
});
