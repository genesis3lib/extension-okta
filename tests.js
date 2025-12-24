/**
 * Genesis3 Module Test Configuration - Okta Extension
 *
 * Tests the complete Okta OAuth2 integration including:
 * - Spring Boot JWT validation and user sync
 * - React authentication flow with PKCE
 * - Django JWT validation and user sync
 * - User profile endpoints
 * - Role-based access control integration
 */

module.exports = {
  moduleId: 'extension-okta',
  moduleName: 'Okta Authentication',

  scenarios: [
    {
      name: 'okta-spring-boot-complete',
      description: 'Okta with Spring Boot - complete integration with user sync and RBAC',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'okta-spring',
        kind: 'extension',
        type: 'okta',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://myorg.okta.com/oauth2/default',
          enableRbac: true,
          roleClaimKey: 'groups',
          tenantIdClaimKey: 'org_id'
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityOktaConfig.java',
        'backend/src/main/java/com/example/security/OktaUserSyncFilter.java',
        'backend/src/main/resources/application-okta.yaml'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/security/OktaUserSyncFilter.java',
          contains: [
            'OktaUserSyncFilter',
            'OncePerRequestFilter',
            'UserService',
            'createOrUpdateUser',
            'roleClaimKey',
            'tenantClaimKey',
            'shouldNotFilter'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/config/SecurityOktaConfig.java',
          contains: [
            'SecurityFilterChain',
            'OktaUserSyncFilter',
            'oauth2ResourceServer',
            'jwt'
          ]
        },
        {
          file: 'backend/src/main/resources/application-okta.yaml',
          contains: [
            'okta:',
            'oauth2:',
            'issuer:',
            'groups' // roleClaimKey value
          ]
        }
      ]
    },
    {
      name: 'okta-spring-boot-single-tenant',
      description: 'Okta with Spring Boot - single tenant (no tenant ID claim)',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'okta-spring-single',
        kind: 'extension',
        type: 'okta',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://single.okta.com/oauth2/default',
          enableRbac: true,
          roleClaimKey: 'groups',
          tenantIdClaimKey: '' // Empty - single tenant
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/security/OktaUserSyncFilter.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/security/OktaUserSyncFilter.java',
          contains: [
            'String tenantId = null'
          ]
        }
      ]
    },
    {
      name: 'okta-react-complete',
      description: 'Okta with React - complete integration with PKCE and protected routes',
      config: {
        moduleId: 'okta-react',
        kind: 'extension',
        type: 'okta',
        providers: ['react'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://frontend.okta.com/oauth2/default',
          enableRbac: true,
          roleClaimKey: 'groups'
        }
      },
      expectedFiles: [
        'frontend/src/providers/OktaProvider.tsx',
        'frontend/src/components/ProtectedRoute.tsx',
        'frontend/src/utils/apiClient.ts',
        'frontend/src/pages/Profile.tsx',
        'frontend/src/pages/OktaCallback.tsx',
        'frontend/src/components/LoginButton.tsx',
        'frontend/src/components/LogoutButton.tsx',
        'frontend/src/hooks/useAuth.ts',
        'frontend/.env'
      ],
      fileContentChecks: [
        {
          file: 'frontend/src/providers/OktaProvider.tsx',
          contains: [
            '@okta/okta-react',
            'Security',
            'OktaAuth',
            'restoreOriginalUri',
            'VITE_OKTA_CLIENT_ID',
            'VITE_OKTA_ISSUER'
          ]
        },
        {
          file: 'frontend/src/components/ProtectedRoute.tsx',
          contains: [
            'useOktaAuth',
            'SecureRoute',
            'isAuthenticated',
            'loginWithRedirect'
          ]
        },
        {
          file: 'frontend/src/utils/apiClient.ts',
          contains: [
            'useApiClient',
            'getAccessToken',
            'Authorization: `Bearer ${token}`',
            'VITE_API_BASE'
          ]
        },
        {
          file: 'frontend/src/pages/OktaCallback.tsx',
          contains: [
            'LoginCallback',
            '@okta/okta-react'
          ]
        },
        {
          file: 'frontend/src/hooks/useAuth.ts',
          contains: [
            'useOktaAuth',
            'isAuthenticated',
            'getAccessToken',
            'logout'
          ]
        }
      ]
    },
    {
      name: 'okta-drf-complete',
      description: 'Okta with Django REST Framework - JWT validation and user sync',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'okta-drf',
        kind: 'extension',
        type: 'okta',
        providers: ['drf'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://django.okta.com/oauth2/default',
          enableRbac: true,
          roleClaimKey: 'groups',
          tenantIdClaimKey: 'org_id'
        }
      },
      expectedFiles: [
        'backend/auth/authentication.py',
        'backend/auth/permissions.py'
      ],
      fileContentChecks: [
        {
          file: 'backend/auth/authentication.py',
          contains: [
            'OktaJWTAuthentication',
            'okta-jwt-verifier',
            'OKTA_ISSUER',
            'OKTA_AUDIENCE',
            'validate_token'
          ]
        },
        {
          file: 'backend/auth/permissions.py',
          contains: [
            'HasRole',
            'groups',
            'IsAuthenticated'
          ]
        }
      ]
    },
    {
      name: 'okta-full-stack-integration',
      description: 'Okta with full-stack (Spring + React) - end-to-end integration',
      dependencies: ['extension-rbac'],
      config: {
        moduleId: 'okta-fullstack',
        kind: 'extension',
        type: 'okta',
        providers: ['spring', 'react'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://fullstack.okta.com/oauth2/default',
          enableRbac: true,
          roleClaimKey: 'groups',
          tenantIdClaimKey: 'org_id'
        }
      },
      expectedFiles: [
        // Backend files
        'backend/src/main/java/com/example/security/OktaUserSyncFilter.java',
        'backend/src/main/java/com/example/config/SecurityOktaConfig.java',
        'backend/src/main/resources/application-okta.yaml',
        // Frontend files
        'frontend/src/providers/OktaProvider.tsx',
        'frontend/src/components/ProtectedRoute.tsx',
        'frontend/src/utils/apiClient.ts',
        'frontend/src/pages/Profile.tsx'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/security/OktaUserSyncFilter.java',
          contains: ['OktaUserSyncFilter', 'createOrUpdateUser']
        },
        {
          file: 'frontend/src/providers/OktaProvider.tsx',
          contains: ['OktaAuth', 'Security']
        }
      ]
    },
    {
      name: 'okta-rbac-disabled',
      description: 'Okta without RBAC - basic authentication only',
      config: {
        moduleId: 'okta-no-rbac',
        kind: 'extension',
        type: 'okta',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          oktaIssuer: 'https://basic.okta.com/oauth2/default',
          enableRbac: false
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityOktaConfig.java'
      ],
      forbiddenFiles: [
        'backend/src/main/java/com/example/security/OktaUserSyncFilter.java'
      ]
    }
  ]
};
