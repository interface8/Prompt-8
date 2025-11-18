# Schema Alignment & Route Parameter Streamlining

## Overview
This document outlines the comprehensive changes made to align all API routes with the Prisma schema constraints, ensuring that required fields are never undefined and nullable fields are properly handled.

## Key Principles Applied

1. **Required Fields**: All non-nullable schema fields must have explicit values (never `undefined`)
2. **Nullable Fields**: Use `null` explicitly for optional fields, not `undefined` or empty strings
3. **Type Safety**: Ensure TypeScript types match Prisma schema constraints
4. **Validation**: Validate required fields before database operations

## Schema Analysis

### Prompt Model (Required Fields)
- `title` - String (required)
- `content` - String (required)
- `category` - String (required)
- `domain` - String (required)
- `template` - String (required)
- `typeId` - String (required) - **Critical: Must reference PromptType**
- `userId` - String (required)
- `slug` - String (required, unique)

### Prompt Model (Nullable Fields)
- `description` - String? (nullable)
- `sampleOutput` - String? (nullable)

### Parameter Model
- `placeholder` - String? (nullable) - **Fixed: Was using empty string ''**
- `required` - Boolean (default: true)

### Purchase Model
- `transactionId` - String? (nullable)
- `paymentMethod` - String (required, default: 'paystack')

## Changes Made

### 1. `/api/prompts/route.ts` (POST)

**Before:**
```typescript
// Used optional chaining and fallbacks
const domainValue = domain ?? category ?? 'General';
const templateValue = template ?? content ?? '';
type: promptType ?? undefined // WRONG: undefined not allowed
```

**After:**
```typescript
// Strict validation of required fields
if (!title || !content || !userId || !category || !domain || !template) {
  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
}

// Auto-create typeId if not provided
let promptTypeId = typeId;
if (!promptTypeId) {
  const defaultType = await prisma.promptType.findFirst({ where: { name: domain } });
  promptTypeId = defaultType?.id || (await prisma.promptType.create({ data: { name: domain } })).id;
}

// All required fields explicitly provided
data: {
  title,
  content,
  slug: generatedSlug,
  userId,
  category,
  domain,
  template,
  typeId: promptTypeId, // Always defined
  price: price ?? 0,
  isPrivate: isPrivate ?? false,
}
```

### 2. `/api/prompts/create/route.ts` (POST)

**Before:**
```typescript
// Mixed nullable/required handling
description, // Could be undefined
sampleOutput, // Could be undefined
placeholder: param.placeholder || '', // WRONG: nullable field using empty string
```

**After:**
```typescript
// Explicit null for nullable fields
description: description || null,
sampleOutput: sampleOutput || null,

// Parameters: Use null for nullable placeholder
parameters.map(param => ({
  placeholder: param.placeholder || null, // Correct: null for nullable
  required: param.required ?? true, // Use ?? for boolean default
}))

// Models: Explicit defaults for required fields
models.map(model => ({
  efficiency: model.efficiency ?? 85, // Always provide value
  recommended: model.recommended ?? false,
}))
```

### 3. `/api/purchases/route.ts` (POST)

**Before:**
```typescript
paymentMethod, // Could be undefined
```

**After:**
```typescript
paymentMethod: paymentMethod || 'paystack', // Always provide default
paymentStatus: 'COMPLETED', // Explicit enum value
```

### 4. `/app/creator/page.tsx` (UI)

**Added:**
```typescript
// Submit handler with proper validation
const handleSubmit = async () => {
  // Validate all required fields
  if (!title || !description || !domain || !template || !category) {
    setSubmitError('Please fill all required fields');
    return;
  }

  // Send properly structured data
  body: JSON.stringify({
    title,
    description,
    domain,
    category: category || domain, // Provide fallback
    template,
    sampleOutput: sampleOutput || null, // Explicit null
    parameters: parameters.map(p => ({
      placeholder: p.placeholder || null, // Nullable field
      required: p.required,
    })),
  }),
}
```

## Slug Generation

**Implemented automatic slug generation:**
```typescript
const generateSlugFromTitle = (t: string) =>
  t
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')         // spaces to underscores
    .replace(/[^a-z0-9_]/g, '')   // remove special chars
    .replace(/_+/g, '_')          // collapse multiple underscores
    .replace(/^_+|_+$/g, '');     // trim leading/trailing underscores

// Example: "My First Prompt!" -> "my_first_prompt"
```

## Type Safety Improvements

### Enum Handling
```typescript
// Before
skillLevel: skillLevel?.toUpperCase() || 'BEGINNER'

// After  
skillLevel: (skillLevel?.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') || 'BEGINNER'

// Parameter types
type: param.type.toUpperCase() as 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA'
```

## Testing Checklist

- [x] Prompt creation with all required fields
- [x] Prompt creation auto-generates typeId if not provided
- [x] Slug generation from title with underscores
- [x] Parameter creation with nullable placeholder
- [x] Model creation with efficiency defaults
- [x] Purchase creation with payment method defaults
- [x] UI validation for required fields
- [x] Build completes without TypeScript errors

## Migration Notes

**For existing data:**
- All prompts must have a `typeId` - the API now auto-creates one based on domain
- Slugs are auto-generated from titles using underscores
- Empty string placeholders in Parameters will remain but new ones use null

**For frontend integration:**
- Forms must provide: `title`, `content`, `category`, `domain`, `template`
- Optional fields should send `null`, not `undefined` or empty strings
- The `typeId` field is now handled automatically by the API

## Best Practices Going Forward

1. **Always validate required fields** before Prisma operations
2. **Use explicit null** for nullable fields, never undefined
3. **Provide defaults** for required fields with sensible values
4. **Type cast enums** explicitly to avoid TypeScript errors
5. **Test with real data** to ensure constraints are met
6. **Document required vs optional** fields in API documentation

## Related Files

- `prisma/schema.prisma` - Schema definition
- `src/app/api/prompts/route.ts` - Basic prompt CRUD
- `src/app/api/prompts/create/route.ts` - Full prompt creation with relations
- `src/app/api/purchases/route.ts` - Purchase flow
- `src/app/creator/page.tsx` - Creator UI with validation
