# Database Migration Guide

## New Schema Updates

The database schema has been significantly enhanced to support the new PromptSearch features:

### New Models:
- **Parameter**: Parametric template parameters for prompts
- **Model**: AI model recommendations with efficiency scores
- **Cart**: Shopping cart for marketplace
- **CartItem**: Items in the cart

### Updated Models:
- **User**: Added `verified`, `totalEarnings`, and updated roles (ADMIN, MANAGER, CREATOR, BUYER, MODERATOR)
- **Prompt**: Added `domain`, `skillLevel`, `license`, `template`, `sampleOutput`, `status` fields
- **Purchase**: Added `paymentMethod`, `paymentStatus`, `transactionId`

### New Enums:
- **SkillLevel**: BEGINNER, INTERMEDIATE, ADVANCED
- **ParameterType**: TEXT, NUMBER, SELECT, TEXTAREA
- **PromptStatus**: DRAFT, PENDING_REVIEW, APPROVED, REJECTED, PUBLISHED
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED

## To Apply Migration:

```bash
# Generate migration
npx prisma migrate dev --name add_marketplace_features

# Generate Prisma Client
npx prisma generate

# (Optional) Seed the database
npm run seed
```

## API Routes Created:

1. **Cart Management** (`/api/cart`)
   - GET: Fetch user cart
   - POST: Add item to cart
   - DELETE: Remove item from cart

2. **Purchases** (`/api/purchases`)
   - GET: Fetch user purchases
   - POST: Process checkout and create purchases

3. **Create Prompts** (`/api/prompts/create`)
   - POST: Create new prompt with parameters and models

## Next Steps:

1. Run migrations to update database
2. Update existing user roles if needed
3. Test API routes with authentication
4. Integrate Paystack payment gateway for production
