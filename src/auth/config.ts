import { JwtModuleOptions, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { jwtConstants } from "./constants"

// Make here a logic for using test values if app in development mode
// Make it in config service or smth like that.
export const expiresInOptions = {
  forRefreshToken: '5 years',
  // forAccessToken: '5 minutes',
  forAccessToken: '5 years',
  forTest: '60 days'
}

export const refreshTokenOptions: JwtSignOptions = {
  secret: jwtConstants.refreshSecret,
  expiresIn: expiresInOptions.forRefreshToken
}

export const refreshTokenVerifyOptions: JwtVerifyOptions = {
  secret: jwtConstants.refreshSecret
}

export const accessTokenOptions: JwtSignOptions = {
  expiresIn: expiresInOptions.forAccessToken
}

// Options for default 'jwtService.sign()' method
// it represents options for access_token.
export const jwtModuleOptions: JwtModuleOptions = {
  secret: jwtConstants.accessSecret,
  signOptions: accessTokenOptions
}