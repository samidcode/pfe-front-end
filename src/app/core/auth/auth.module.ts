import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
    imports  : [
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => {
                    // Implement your logic to retrieve the JWT token from your storage (e.g., localStorage).
                    return sessionStorage.getItem('accessToken');
                },            },
          }),
    ],
    providers: [
        AuthService,
        {
            provide : HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi   : true
        }
    ]
})
export class AuthModule
{
}
