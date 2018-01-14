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
        // 关闭其他选项
        $(this).prevAll().find('ul.sub-toollink-function-list').hide();
        $(this).nextAll().find('ul.sub-toollink-function-list').hide();
        // 主选项自动关闭或开启
        $(this).find('ul.sub-toollink-function-list').toggle();
    });
    jQuery('ul.toollink-function-list li ul.sub-toollink-function-list li').live('click', function (e) {
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
        var data = [];
        opts && Object.keys(opts).forEach(function (item) {
            var obj = JSON.parse(opts[item]);
            // 第一个
            if (data.length == 0) {
                var items = [];
                data.push({
                    id: obj.type_id,
                    type: obj.type_name,
                    sort: obj.type_sort,
                    description: obj.type_description,
                    items: items
                });
            }

            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].type == obj.type_name && data[i].id == obj.type_id && data[i].description == obj.type_description) {
                    // 有，则添加到子项
                    data[i].items.push({
                        id: obj.id,
                        url: obj.url,
                        target: obj.target,
                        name: obj.name,
                        description: obj.description,
                        sort: obj.sort
                    });
                    break;
                } else if (i == (len - 1)) {
                    // 没有，则新建一个类别，再增加一个子项
                    var items = [];
                    items.push({
                        id: obj.id,
                        url: obj.url,
                        target: obj.target,
                        name: obj.name,
                        description: obj.description,
                        sort: obj.sort
                    });
                    data.push({
                        id: obj.type_id,
                        type: obj.type_name,
                        sort: obj.type_sort,
                        description: obj.type_description,
                        items: items
                    });
                }
            }
        });
        // 排序方法
        function jsonSort(a, b) {
            return a.sort - b.sort;
        }
        // 第一层排序
        data = data.sort(jsonSort);
        for (var i = 0; i < data.length; i++) {
            // 第二层排序
            data[i].items = data[i].items.sort(jsonSort);
        }
        var outhtml = template2_setdata($('#tool_template_new_datasource_content').html(), data);
        $('.toollink-function-list').append(outhtml);
    })
});



