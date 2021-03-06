<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use SocialiteProviders\Facebook\FacebookExtendSocialite;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        // 'Laravel\Passport\Events\AccessTokenCreated' => [
        //     'App\Listeners\RevokeOldTokens',
        // ],

        // 'Laravel\Passport\Events\RefreshTokenCreated' => [
        //     'App\Listeners\PruneOldTokens',
        // ],
        \SocialiteProviders\Manager\SocialiteWasCalled::class => [
            // add your listeners (aka providers) here
            'SocialiteProviders\GooglePlus\GooglePlusExtendSocialite@handle',
            'SocialiteProviders\DailyMotion\DailyMotionExtendSocialite@handle',
            'SocialiteProviders\Vimeo\VimeoExtendSocialite@handle',
            'SocialiteProviders\Youtube\YoutubeExtendSocialite@handle',
            'SocialiteProviders\Twitter\TwitterExtendSocialite@handle',
            'SocialiteProviders\Facebook\FacebookExtendSocialite@handle',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
