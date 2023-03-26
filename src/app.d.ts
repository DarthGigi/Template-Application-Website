// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      validate: import('@lucia-auth/sveltekit').Validate;
      validateUser: import('@lucia-auth/sveltekit').ValidateUser;
      setSession: import('@lucia-auth/sveltekit').SetSession;
    }
    // interface PageData {}
    // interface Platform {}
  }
  var prisma: PrismaClient;

  /// <reference types="lucia-auth" />
  declare namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type UserAttributes = {
      name: string;
      password: string;
    };
  }
}

export {};
