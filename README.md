# phone-number

A phone numbers tool library that can be run on the web, node and Android.  
Features:  
- Tell if two number ( with different formating ) are the same.  
- Generate pretty string for printing number.  
- Check if a number is dialable.  
- Convert raw user input to e164 formated number.

## How to use

Refer to JS docs annotations.

## On the web ( note applicable on node )

To run in the browser either include this html tag in the page: 
```html
<script src="//github.com/garronej/phone-number/releases/download/intlTelInputUtils/utils.js>"></script>
```

Or lazily load the heavy utils script dependency with:
```ts
await phoneNumber.remoteLoadUtil();
```
By default the script is loaded from:  
``//github.com/garronej/phone-number/releases/download/intlTelInputUtils/utils.js``
Some old browser require the script to be downloaded from the site's domain  
in this case use:
```ts
await phoneNumber.remoteLoadUtil("//my-page.com/utils.js");
```
And host ``utils.js`` on your server.

## On Android

Place ``./phone_number.js`` in ``res/raw`` in your android project.  

Include ``LiquidPlayer/LiquidCore`` to your android project.
build.gradle:
```gradle
dependencies {
  compile 'com.github.LiquidPlayer:LiquidCore:0.5.0'
}
```
Import (copy/paste) the class ``./PhoneNumber.java`` to your package.

After that static class ``PhoneNumber`` provide the same API that the JS lib
except for function optional argument where java ``null`` should be passed in   
place of javascript ``undefined``.


