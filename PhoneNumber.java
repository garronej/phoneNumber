
package [YOUR_PACKAGE];

import android.text.TextUtils;

import org.liquidplayer.javascript.JSContext;
import org.liquidplayer.javascript.JSException;
import org.liquidplayer.javascript.JSValue;

import java.io.InputStream;
import java.util.Scanner;

public class PhoneNumber {

    private static JSContext jsContext;

    private static synchronized void initJsContext(){

        if( jsContext != null ){
            return;
        }

        jsContext = new JSContext();

        InputStream ins = App.getContext().getResources().openRawResource(
                App.getContext().getResources().getIdentifier("phone_number",
                        "raw", App.getContext().getPackageName()));

        String script = new Scanner(ins,"UTF-8").useDelimiter("\\A").next();

        jsContext.evaluateScript(script);

    }

    /** null are transformed in undefined */
    private static JSValue makeJsQuery(String functionName, Object[] args) throws JSException {


        int length = args != null ? args.length : 0;

        String[] strArgs= new String[length];

        for( int i = 0; i<length; i++){

            Object arg= args[i];

            String str;

            if( arg == null ){
                str = "undefined";
            }else if( arg instanceof String ){
                str = "'" + arg + "'";
            }else if( arg instanceof Boolean ) {
                str = (Boolean) arg ? "true" : "false";
            }else if( arg instanceof Integer) {
                str = String.valueOf(arg);
            }else if( arg instanceof Character){
                str= arg.toString();
            }else{
                throw new RuntimeException("Not a valid argument: " + arg);
            }

            strArgs[i]= str;

        }


        if( jsContext == null ){

            initJsContext();

        }

        jsContext.evaluateScript( "var out= global['phoneNumber']." + functionName + "(" + TextUtils.join(", ", strArgs) + ");" );

        return jsContext.property("out");

    }


    /** Return null if not dialable */
    public static String build(
            String rawInput,
            String iso,
            boolean mustBeDialable
    ){

        JSValue out;

        try {

            out= makeJsQuery(
                    "build",
                    new Object[]{ rawInput, iso, mustBeDialable?"MUST BE DIALABLE":null }
                    );

        }catch(JSException e) {

            return null;

        }


        return out.toString();


    }

    public static boolean isDialable( String phoneNumber ){


        JSValue out= makeJsQuery(
                    "isDialable",
                    new Object[]{ phoneNumber }
            );

        return out.toBoolean();

    }

    /** simIso can be null */
    public static String prettyPrint(
            String phoneNumber,
            String simIso
    ){

        JSValue out= makeJsQuery(
                "prettyPrint",
                new Object[]{ phoneNumber, simIso }
        );

        return out.toString();

    }

    /** simIso can be null */
    public static boolean areSame(
            String phoneNumber,
            String rawInput
    ){

        JSValue out= makeJsQuery(
                "areSame",
                new Object[]{ phoneNumber, rawInput }
        );

        return out.toBoolean();

    }


}

