<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DomainController extends Controller
{
    public function sponsor(Request $request)
    {
        return view('app');
    }

    public function app()
    {
        return view('app');
    }
}
