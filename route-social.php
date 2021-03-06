<?php 

Route::get('/auth/providers/{provider}/', function($provider){
    // $user = $request->user();
    $provider = Provider::findBySlug($provider);
    $clientId = $provider->client_id;
    $clientSecret = $provider->client_secret;
    $redirectUrl =  $provider->redirect_url;
    $config = new \SocialiteProviders\Manager\Config($clientId, $clientSecret, $redirectUrl);
    return \Socialite::driver($provider->slug)->setConfig($config)->redirect();
});

Route::get('/auth/providers/{provider}/callback', function($provider){
    $user = \Socialite::driver($provider)->user();
    return  response()->json($user);
});

Route::get('/twitter', function(){
    // Always Check For Stateless capability, Oauth1 is not stateless...
    // all in One Folder in laravel sociate dont have stateless or api capabilities
        // get the config from platform table
        $clientId = "RlB6T8QimvLI0VFiGMEgSdDIG";
        $clientSecret = "UQTdtSssUAMf1HPrlXsyItlIogfknM63YPYVe75YgWXQvq7uEI";
        $redirectUrl = "http://seobooster.app/providers/twitter/callback";
        $config = new \SocialiteProviders\Manager\Config($clientId, $clientSecret, $redirectUrl);
        return \Socialite::with('twitter')->setConfig($config)->redirect();
        });
    Route::get('/providers/twitter/callback', function(){
        $user = \Socialite::driver('twitter')->user();
    // $user->accessTokenResponseBody
    // "oauth_token": "2878046635-79xesuwmI1DExvSOnHh5WFLLjTM5CiU7urOJM5Y",
    // "oauth_token_secret": "hrmcLWaPRVn95eYJf5GMDUck9PKDPdMwC3TOw0uXZEzws",
    // "user_id": "2878046635",
    // "screen_name": "uriahg17",
    // "x_auth_expires": "0"
    // Save this to the Twitter Database
        return  response()->json($user);
    // POST API by twitter
    // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
    });
    