## Table `AssociationRequest`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `senderid` | `uuid` |  |
| `vetcenteremail` | `varchar` |  |
| `useremail` | `varchar` |  |
| `senderrole` | `user_role` |  |
| `status` | `request_status` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |
| `clientid` | `uuid` |  Nullable |

## Table `Client`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `userid` | `uuid` |  Nullable |
| `veterinarycenterid` | `uuid` |  |
| `name` | `varchar` |  |
| `email` | `varchar` |  Unique with `veterinarycenterid` |
| `phone` | `varchar` |  Nullable |
| `extrainfo` | `text` |  Nullable |
| `isactive` | `bool` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

## Table `Pet`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `legalidentifier` | `varchar` |  Nullable Unique |
| `name` | `varchar` |  |
| `species` | `varchar` |  Nullable |
| `breed` | `varchar` |  Nullable |
| `birthdate` | `date` |  Nullable |
| `isverified` | `bool` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |
| `weight` | `int4` |  Nullable |
| `vaccines` | `bool` |  Nullable |

## Table `PetClient`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `petid` | `uuid` |  |
| `clientid` | `uuid` |  |
| `extrafields` | `text` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

## Table `PetUser`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `petid` | `uuid` |  |
| `userid` | `uuid` |  |
| `extrafields` | `text` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

## Table `Professional`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `userid` | `uuid` |  |
| `veterinarycenterid` | `uuid` |  Nullable |
| `licensenumber` | `varchar` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

## Table `User`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `varchar` |  |
| `phone` | `varchar` |  Nullable |
| `role` | `user_role` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `lgpdconsent` | `bool` |  Nullable |
| `lgpdconsentdate` | `timestamp` |  Nullable |
| `isactive` | `bool` |  Nullable |
| `deletedat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

## Table `VeterinaryCenter`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `email` | `varchar` |  Unique |
| `name` | `varchar` |  Nullable |
| `address` | `varchar` |  Nullable |
| `phone` | `varchar` |  Nullable |
| `createdat` | `timestamp` |  Nullable |
| `updatedat` | `timestamp` |  Nullable |

