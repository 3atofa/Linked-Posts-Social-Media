1-
    <!-- ^ provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:'top'})), provideClientHydration(withEventReplay()), -->

    <!-- ~ to start from top when i change route -->

# authentication 

    app:
        layouts:
            auth-layout
            blank-layout
            navbar
            footer

    2- auth guards in routing
        canActive auth guard 
        1- logedin guard check if token exists then routes to home
        2- auth guard check if user is not loged in then routes to login.

    3- token handling jwt

# ngx infinite scroll


# loading spinner
    ngx-spinnner 

    1- create interceptor 
    2- add to app.componnent.html : spinner

    