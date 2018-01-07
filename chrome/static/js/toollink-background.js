/**
 * 后台运行程序-总入口的各项实现
 * @author jim
 * @date 2018/01/07
 */
var BgPageInstance = (function () {

    /**
     * 文本格式，可以设置一个图标和标题
     * @param {Object} options
     * @config {string} type notification的类型，可选值：html、text
     * @config {string} icon 图标
     * @config {string} title 标题
     * @config {string} message 内容
     */
    var notifyText = function (options) {
        if (!window.Notification) {
            return;
        }
        if (!options.icon) {
            options.icon = "static/img/toollink-48.png";
        }
        if (!options.title) {
            options.title = "温馨提示";
        }

        return chrome.notifications.create('', {
            type: 'basic',
            title: options.title,
            iconUrl: chrome.runtime.getURL(options.icon),
            message: options.message
        });

    };

    /**
     * 创建或更新成功执行的动作
     * @param evt
     * @param content
     * @private
     */
    var _tabUpdatedCallback = function (evt, content) {
        return function (newTab) {
            if (content) {
                setTimeout(function () {
                    chrome.tabs.sendMessage(newTab.id, {
                        type: MSG_TYPE.TAB_CREATED_OR_UPDATED,
                        content: content,
                        event: evt
                    });
                }, 300)
            }
        };
    };

    /**
     * 打开对应文件，运行该Helper
     * @param tab
     * @param file
     * @param txt
     * @private
     */
    var _openFileAndRun = function (tab, file, txt) {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
            var isOpened = false;
            var tabId;
            var reg = new RegExp("^chrome.*" + file + ".html$", "i");
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (reg.test(tabs[i].url)) {
                    isOpened = true;
                    tabId = tabs[i].id;
                    break;
                }
            }
            if (!isOpened) {
                chrome.tabs.create({
                    url: 'template/toollinkhelper_' + file + '.html',
                    active: true
                }, _tabUpdatedCallback(file, txt));
            } else {
                chrome.tabs.update(tabId, {highlighted: true}, _tabUpdatedCallback(file, txt));
            }
        });
    };

    /**
     * 打开在线Helper
     * @param url
     * @private
     */
    var _goOnlineHelperTool = function (url) {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
            var isOpened = false;
            var tabId;
            var reg = new RegExp(url + "$", "i");
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (reg.test(tabs[i].url)) {
                    isOpened = true;
                    tabId = tabs[i].id;
                    break;
                }
            }
            if (!isOpened) {
                chrome.tabs.create({
                    url: url,
                    active: true
                });
            } else {
                chrome.tabs.update(tabId, {highlighted: true});
            }
        });
    };

    /**
     * 根据给定参数，运行对应的Helper
     */
    var _runHelper = function (config) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            // 如果是采用独立文件方式访问，直接打开该页面即可
            if (config.useFile == '1') {
                var content = '';
                _openFileAndRun(tab, config.msgType, content);
            } else {
                switch (config.msgType) {
                    //在线Helper
                    case MSG_TYPE.ONLINE_URL:
                        _goOnlineHelperTool(config.url);
                        break;
                    default :
                        break;
                }
            }
        });
    };

    /**
     * 接收来自content_scripts发来的消息
     */
    var _addExtensionListener = function () {
        chrome.runtime.onMessage.addListener(function (request, sender, callback) {
            //处理CSS的请求
            if (request.type == MSG_TYPE.GET_CSS) {
                //直接AJAX获取CSS文件内容
                jsoft.network.readFileContent(request.link, callback);
            }
            //处理JS的请求
            else if (request.type == MSG_TYPE.GET_JS) {
                //直接AJAX获取JS文件内容
                jsoft.network.readFileContent(request.link, callback);
            }
            //处理HTML的请求
            else if (request.type == MSG_TYPE.GET_HTML) {
                //直接AJAX获取JS文件内容
                jsoft.network.readFileContent(request.link, callback);
            }
            //处理cookie
            else if (request.type == MSG_TYPE.GET_COOKIE) {
                jsoft.network.getCookies(request, callback);
            }
            //移除cookie
            else if (request.type == MSG_TYPE.REMOVE_COOKIE) {
                jsoft.network.removeCookie(request, callback);
            }
            //设置cookie
            else if (request.type == MSG_TYPE.SET_COOKIE) {
                jsoft.network.setCookie(request, callback);
            }
            //提取配置项
            else if (request.type == MSG_TYPE.GET_OPTIONS) {
                jsoft.toollinkOption.doGetOptions(request.items, callback);
            }
            //保存配置项
            else if (request.type == MSG_TYPE.SET_OPTIONS) {
                jsoft.toollinkOption.doSetOptions(request.items, callback);
            }
            // 从popup中点过来的
            else if (request.type == MSG_TYPE.FROM_POPUP) {
                _runHelper(request.config);
            }

            return true;
        });
    };

    /**
     * 初始化
     */
    var _init = function () {
        _addExtensionListener();
    };

    return {
        init: _init,
        runHelper: _runHelper
    };
})();

//初始化
BgPageInstance.init();

