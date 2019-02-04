# phone-number

A phone numbers tool library that can be run on the web, node and Android.  
Feature: Tell if two number ( with different formating ) are the same,
generate pretty string for printing number, check if a number is dialable,
convert to e164 formated number.

## How to use

Refer to JS docs annotations.

## On the web ( note applicable on node )

To run in the browser either include this html tag in the page: 
```html
<script src="//github.com/garronej/phone-number/releases/download/intlTelInputUtils/utils.js>"></script>
```

Or run to lazily load the heavy utils script dependency.
```ts
await phoneNumber.remoteLoadUtil();
```

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

Set context before being able to call the functions:
```java
PhoneNumber.setContext(context);
```

After that static class ``PhoneNumber`` provide the same API that the JS lib
except for function optional argument where java ``null`` should be passed in   
place of javascript ``undefined``.


