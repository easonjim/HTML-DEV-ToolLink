/**
 * 弹出（下拉）页面-各项实现
 * @author jim
 * @date 2018/01/07
 */
$(function () {
    // 获取后台页面，返回window对象
    var bgPage = chrome.extension.getBackgroundPage();
    // 菜单点击以后执行的动作
    jQuery('ul.toollink-function-list li').live('click', function (e) {
        var msgType = $(this).attr('data-msgtype');
        var isUseFile = $(this).attr('data-usefile');
        var url = $(this).attr('data-url');

        bgPage.BgPageInstance.runHelper({
            msgType: MSG_TYPE[msgType],
            useFile: isUseFile,
            url:url
        });

        window.close();
    });

    // 设置
    jQuery('.toollink-feedback .x-settings').click(function (e) {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
            var url = "template/toollinkhelper_options.html";
            var isOpened = false;
            var tabId;
            var reg = new RegExp("^chrome.*" + url + "$", "i");
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
    });

    // 根据配置，控制功能菜单的显示与隐藏
    jsoft.toollinkOption.init();
    jsoft.toollinkOption.doGetOptions(jsoft.toollinkOption.optionItems, function (opts) {
        opts && Object.keys(opts).forEach(function (item) {
            var outhtml = template2_setdata($('#tool_template_new_datasource_content').html(), JSON.parse(opts[item]));
            $('.toollink-function-list').append(outhtml);
        });
    })
});



