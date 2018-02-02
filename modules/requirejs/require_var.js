var requirejs, require, define;

var req, 
    s, 
    head, 
    baseElement, 
    dataMain, 
    src,
    interactiveScript, 
    currentlyAddingScript, 
    mainScript, 
    subPath,
    version = '2.1.22',
    commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
    cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
    jsSuffixRegExp = /\.js$/,
    currDirRegExp = /^\.\//,
    op = Object.prototype,
    ostring = op.toString,
    hasOwn = op.hasOwnProperty,
    ap = Array.prototype,
    isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
    isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
    //PS3 indicates loaded and complete, but need to wait for complete
    //specifically. Sequence is 'loading', 'loaded', execution,
    // then 'complete'. The UA check is unfortunate, but not sure how
    //to feature test w/o causing perf issues.
    readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                  /^complete$/ : /^(complete|loaded)$/,
    defContextName = '_',
    //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
    isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
    contexts = {},
    cfg = {},
    globalDefQueue = [],
    useInteractive = false;
