/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from 'zod';
// File: TransactionIsolationLevel.schema.ts

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable'])

export type TransactionIsolationLevel = z.infer<typeof TransactionIsolationLevelSchema>;

// File: GeneratedImagesScalarFieldEnum.schema.ts

export const GeneratedImagesScalarFieldEnumSchema = z.enum(['id', 'createdAt', 'prompt', 'model', 'requestId', 'aspectRatio', 'width', 'height', 'imageUrl', 'objectKey', 'imageData', 'mimeType', 'userId'])

export type GeneratedImagesScalarFieldEnum = z.infer<typeof GeneratedImagesScalarFieldEnumSchema>;

// File: RelationLoadStrategy.schema.ts

export const RelationLoadStrategySchema = z.enum(['query', 'join'])

export type RelationLoadStrategy = z.infer<typeof RelationLoadStrategySchema>;

// File: UsersScalarFieldEnum.schema.ts

export const UsersScalarFieldEnumSchema = z.enum(['id', 'createdAt', 'updatedAt', 'name', 'email', 'emailVerified', 'image'])

export type UsersScalarFieldEnum = z.infer<typeof UsersScalarFieldEnumSchema>;

// File: AccountsScalarFieldEnum.schema.ts

export const AccountsScalarFieldEnumSchema = z.enum(['id', 'createdAt', 'updatedAt', 'accessToken', 'refreshToken', 'idToken', 'accessTokenExpiresAt', 'refreshTokenExpiresAt', 'scope', 'password', 'accountId', 'providerId', 'userId'])

export type AccountsScalarFieldEnum = z.infer<typeof AccountsScalarFieldEnumSchema>;

// File: VerificationsScalarFieldEnum.schema.ts

export const VerificationsScalarFieldEnumSchema = z.enum(['id', 'createdAt', 'updatedAt', 'expiresAt', 'identifier', 'value'])

export type VerificationsScalarFieldEnum = z.infer<typeof VerificationsScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(['asc', 'desc'])

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(['default', 'insensitive'])

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: NullsOrder.schema.ts

export const NullsOrderSchema = z.enum(['first', 'last'])

export type NullsOrder = z.infer<typeof NullsOrderSchema>;

// File: GeneratedImages.schema.ts

export const GeneratedImagesSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  prompt: z.string(),
  model: z.string(),
  requestId: z.string().nullish(),
  aspectRatio: z.string().nullish(),
  width: z.number().int().default(1024),
  height: z.number().int().default(1024),
  imageUrl: z.string().nullish(),
  objectKey: z.string().nullish(),
  imageData: z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, "Must be valid base64 string").max(22369622, "Base64 string too long").nullish(),
  mimeType: z.string().default("image/png"),
  userId: z.string().nullish(),
});

export type GeneratedImagesType = z.infer<typeof GeneratedImagesSchema>;


// File: Users.schema.ts

export const UsersSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
});

export type UsersType = z.infer<typeof UsersSchema>;


// File: Accounts.schema.ts

export const AccountsSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  idToken: z.string().nullish(),
  accessTokenExpiresAt: z.date().nullish(),
  refreshTokenExpiresAt: z.date().nullish(),
  scope: z.string().nullish(),
  password: z.string().nullish(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
});

export type AccountsType = z.infer<typeof AccountsSchema>;


// File: Verifications.schema.ts

export const VerificationsSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
  identifier: z.string(),
  value: z.string(),
});

export type VerificationsType = z.infer<typeof VerificationsSchema>;

