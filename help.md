# Okta Authentication

This extension adds OAuth2 authentication using Okta to your application. Okta handles user login, registration, password reset, and multi-factor authentication so you don't have to build these features yourself.

## Prerequisites

Before configuring this extension, you need to:
1. Create a free Okta Developer account at https://developer.okta.com
2. Create an Okta Application (Single Page Application type for React frontend)
3. Create an API in Okta for backend authentication

## How to Create an Okta Application

### 1. Sign up for Okta Developer Account

1. Go to https://developer.okta.com/signup
2. Fill in your details and click "Sign Up"
3. You'll receive an email with your Okta domain (e.g., `https://dev-123456.okta.com`)
4. Click the activation link in your email and set your password

### 2. Create a New Application

1. Log into your Okta Admin Console
2. Go to **Applications → Applications** in the left sidebar
3. Click **"Create App Integration"**
4. Select **"OIDC - OpenID Connect"** as the sign-in method
5. Select **"Single-Page Application"** as the application type
6. Click **"Next"**

### 3. Configure Application Settings

**General Settings**:
- **App integration name**: Enter your application name (e.g., "My App")

**Sign-in redirect URIs**:
- For local development: `http://localhost:5173/login/callback`
- For production: `https://yourapp.com/login/callback`

**Sign-out redirect URIs**:
- For local development: `http://localhost:5173`
- For production: `https://yourapp.com`

**Assignments**:
- Select **"Allow everyone in your organization to access"** (or configure specific groups)

Click **"Save"**

### 4. Note Your Application Credentials

After creating the application, go to the **"General"** tab and note:
- **Client ID**: You'll need this as `OKTA_CLIENT_ID`
- **Okta domain**: Your org URL (e.g., `https://dev-123456.okta.com`)

### 5. Create an API (Authorization Server)

Okta uses the "default" authorization server by default:
- **Issuer URL**: `https://your-domain.okta.com/oauth2/default`
- **Audience**: `api://default`

To create a custom authorization server (optional):
1. Go to **Security → API** in the left sidebar
2. Click **"Add Authorization Server"**
3. Enter name and audience identifier
4. Add scopes and access policies as needed

---

## Configuration Fields

### Scaffold Configuration

These settings are configured once during project generation.

#### Enable Role-Based Access Control `enableRbac`
**What it is**: Determines whether to include role-based permissions in your application (e.g., admin users vs regular users).

**Options**:
- `true` (default): Users can have roles like "admin", "user", "moderator" that control what they can access
- `false`: All authenticated users have the same permissions

**When to use**:
- Enable if you need different permission levels (recommended for most apps)
- Disable if all users should have identical access

---

#### Role Claim Key `roleClaimKey`
**What it is**: The name of the field in the authentication token where user roles/groups are stored.

**Default value**: `groups` (Okta's default claim for user groups)

**How Okta Groups Work**:
1. In Okta Admin Console, go to **Directory → Groups**
2. Create groups like "admin", "user", "moderator"
3. Assign users to groups
4. Groups are automatically included in tokens as the `groups` claim

**Custom Claims**:
If you want to use a custom claim key:
1. Go to **Security → API → Authorization Servers**
2. Select your authorization server (or "default")
3. Go to **Claims** tab
4. Add a custom claim (e.g., `roles`) that maps to groups

**Note**: The default `groups` claim works for most applications.

---

#### Tenant ID JWT Claim Key `tenantIdClaimKey`
**What it is**: If your application serves multiple organizations/companies (multi-tenant), this is the field name where the organization ID is stored in the token.

**Default value**: Empty (for single-tenant applications)

**When to use**:
- **Leave empty** if you're building an app for a single company/organization
- **Fill in** if your app serves multiple organizations (like Slack, where each workspace is a separate tenant)

**Example**: If you're building a SaaS product where Company A and Company B each have their own isolated data, you'd use this to identify which company a user belongs to.

**How to implement multi-tenancy in Okta**:
1. Use Okta's custom profile attributes to store organization/tenant ID
2. Add a custom claim in your authorization server that includes this attribute
3. Use the claim key here (e.g., `org_id`)

---

### Runtime Configuration

These are the credentials from your Okta application. You'll need to get these from the Okta Admin Console.

#### Okta Issuer `OKTA_ISSUER`
**What it is**: Your Okta authorization server issuer URL where authentication happens.

**How to find it**:
1. Log into Okta Admin Console
2. Go to **Security → API**
3. You'll see your authorization servers listed
4. For the "default" server, the issuer is: `https://your-domain.okta.com/oauth2/default`
5. For custom servers, click on it to see the issuer URL

**Format**: Full URL including `https://` and `/oauth2/default` (e.g., `https://dev-123456.okta.com/oauth2/default`)

**Common values**:
- Default: `https://your-domain.okta.com/oauth2/default`
- Custom: `https://your-domain.okta.com/oauth2/custom-auth-server-id`

---

#### Okta Client ID `OKTA_CLIENT_ID`
**What it is**: Your application's unique identifier in Okta.

**How to find it**:
1. Log into Okta Admin Console
2. Go to **Applications → Applications**
3. Click on your application
4. Look for **"Client ID"** in the General tab
5. Copy the client ID (e.g., `0oa1b2c3d4e5f6g7h8i9`)

**Format**: A string of random characters (e.g., `0oa1b2c3d4e5f6g7h8i9`)

**Common mistakes**:
- Don't confuse Client ID with Org ID
- Don't include quotes or spaces when copying

---

#### Okta Client Secret `OKTA_CLIENT_SECRET`
**What it is**: Your application's secret key used for backend authentication (not needed for Single Page Applications).

**Note**: For Single Page Applications (React frontend), you typically **DON'T need** a client secret because Okta uses PKCE (Proof Key for Code Exchange) for security.

**When you might need it**:
- If you're using a confidential client (server-side application)
- For machine-to-machine authentication

**How to find it** (if using confidential client):
1. Log into Okta Admin Console
2. Go to **Applications → Applications**
3. Click on your application
4. Go to **"General"** tab
5. Look for **"Client Credentials"** section
6. Click **"Edit"** and select **"Use Client Authentication"**
7. The client secret will be displayed

**Security**: Keep this secret! Never commit it to your code repository or expose it in client-side code.

---

#### Okta Audience `OKTA_AUDIENCE`
**What it is**: The intended recipient of the access token (your API identifier).

**Default value**: `api://default` (Okta's default API audience)

**How to find it**:
1. Log into Okta Admin Console
2. Go to **Security → API**
3. Click on your authorization server
4. The **"Audience"** is shown in the settings
5. For the default server, it's `api://default`

**Custom audience**:
- If you created a custom authorization server, use the audience you specified
- Format: Can be a URL (e.g., `https://api.myapp.com`) or identifier (e.g., `api://default`)

---

## How It Works

### Authentication Flow

1. **User clicks "Log In"** → Redirects to Okta hosted login page
2. **User enters credentials** → Okta validates and authenticates
3. **Okta redirects back** → With authorization code
4. **Frontend exchanges code for tokens** → Gets access token and ID token
5. **Frontend sends API requests** → Includes access token in Authorization header
6. **Backend validates token** → Verifies with Okta's public keys
7. **Backend syncs user** → Creates/updates user in local database with roles
8. **Backend returns data** → Protected endpoint accessible

### Token Claims

Okta access tokens and ID tokens contain claims about the user:

**Standard claims**:
- `sub`: User's Okta ID
- `email`: User's email address
- `name`: User's full name
- `given_name`: First name
- `family_name`: Last name
- `preferred_username`: Username

**Custom claims**:
- `groups`: User's Okta groups (if enabled)
- Any custom claims you've configured

### Role-Based Access Control

If RBAC is enabled:
1. Users are assigned to Okta groups (e.g., "admin", "user")
2. Groups are included in the token as the `groups` claim
3. Backend reads the `groups` claim and assigns roles
4. Backend enforces permissions based on roles

---

## Common Issues

### "Invalid issuer" Error
**Problem**: Okta issuer URL is incorrect.

**Solutions**:
- Verify issuer URL includes `/oauth2/default` or your custom auth server ID
- Format: `https://your-domain.okta.com/oauth2/default`
- Don't use `https://your-domain.okta.com` without `/oauth2/default`

### "Invalid client" Error
**Problem**: Client ID is wrong or application is not configured correctly.

**Solutions**:
- Double-check Client ID in Okta Admin Console → Applications
- Verify application type is "Single Page Application"
- Ensure application is assigned to users/groups

### "Redirect URI mismatch" Error
**Problem**: Redirect URI doesn't match what's configured in Okta.

**Solutions**:
- Go to Okta Admin Console → Applications → Your App → General
- Add your redirect URI to **"Sign-in redirect URIs"**
- Format: `http://localhost:5173/login/callback` (for dev) or `https://yourapp.com/login/callback` (for prod)
- Must be exact match (including trailing slash if present)

### "Groups claim not found" Error
**Problem**: Groups claim is not included in tokens.

**Solutions**:
- Go to **Security → API → Authorization Servers**
- Select your auth server → **Claims** tab
- Verify there's a `groups` claim that includes user groups
- If missing, add it: Name=`groups`, Include in=`Access Token`, Value type=`Groups`, Filter=`Matches regex .*`

### Token Validation Fails
**Problem**: Backend can't validate Okta tokens.

**Solutions**:
- Verify Spring Boot has `okta-spring-boot-starter` dependency
- Check `OKTA_ISSUER` matches exactly (including `/oauth2/default`)
- Verify `OKTA_AUDIENCE` is correct
- Test token at https://jwt.io to inspect claims

---

## Testing Your Setup

### 1. Test Login Flow

1. Start your application
2. Click "Log In"
3. You should be redirected to Okta login page
4. Enter your Okta credentials
5. You should be redirected back to your app, now authenticated

### 2. Test API Access

1. Log in to your frontend
2. Open browser developer console (F12)
3. Go to Network tab
4. Make an API request to a protected endpoint
5. Check the request headers - should include `Authorization: Bearer <token>`
6. Check the response - should return data (not 401 Unauthorized)

### 3. Test Role-Based Access

1. In Okta Admin Console, assign yourself to different groups
2. Log in to your app
3. Call the `/api/v1/protected/user/profile` endpoint
4. Verify the `roles` field includes your groups

---

## Best Practices

1. **Security**:
   - Always use HTTPS in production
   - Never expose Client Secret in client-side code
   - Use PKCE for Single Page Applications (enabled by default)
   - Rotate credentials if compromised

2. **User Experience**:
   - Customize Okta login page with your branding (Okta Admin → Customization)
   - Use social login providers (Google, Facebook) for easier sign-up
   - Enable self-service password reset

3. **Development**:
   - Use separate Okta orgs for dev/staging/production
   - Test with multiple user roles
   - Monitor authentication logs in Okta

4. **Production**:
   - Set up rate limiting on authentication endpoints
   - Monitor failed login attempts
   - Enable MFA for admin users
   - Review Okta security recommendations

---

## Additional Resources

- **Okta Developer Portal**: https://developer.okta.com
- **Okta Documentation**: https://developer.okta.com/docs
- **Okta React SDK**: https://github.com/okta/okta-react
- **Okta Spring Boot Starter**: https://github.com/okta/okta-spring-boot
- **Okta Python JWT Verifier**: https://github.com/okta/okta-jwt-verifier-python
- **Community Forum**: https://devforum.okta.com
