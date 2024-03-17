/**
 * routes that don't need authentication 
 */

export const publicRoutes = [
    "/",
    "/auth/new-verify",
    "/auth/new-password",
    
];

/**
 * public routes
 */

 export const publicPrefix = ['/search', '/blog', '/user']
/**
 * Used for authentication and redirect to edit page
 */
export const authRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/error",
    "/auth/reset"
];



export const noNavBarRoutes = [
    "/auth/error",
    "/auth/reset",
    "/auth/new-verify",
    "/auth/new-password"
]
/**
 * api for authentication 
 */
export const apiAuthPrefix = ["/api/auth","/api/blogs", "/api/users", '/api/likes', '/api/comments']

export const DEFAULT_LOGIN_REDIRECT = "/";