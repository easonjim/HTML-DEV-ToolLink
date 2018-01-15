/**
 * 配置项页面-各项实现
 * 从background-page获取配置项
 * @author jim
 * @date 2018/01/07
 */
jsoft.toollinkOption = (function () {

    // 所有配置项Key
    var optionItemKey = "Tool-";

    // 所有配置项数据源Key
    var optionItemUrlKey = "URL-";

    // 所有配置项
    var optionItems = [];

    // 所有配置项数据源
    var optionItemUrls = [];

    /**
     * 从缓存中初始化所有配置项
     */
    var _initOptionItems = function () {
        var localStorage = _getLocalStorage();
        for (var key in localStorage) {
            if (key.indexOf(optionItemKey) >= 0) {
                var toolObject = localStorage.getItem(key);
                var item = {};
                item[key] = toolObject;
                optionItems.push(item);
            }
        }
    };

    /**
     * 从缓存中删除所有配置项
     */
    var _removeOptionItems = function () {
        var localStorage = _getLocalStorage();
        for (var key in localStorage) {
            if (key.indexOf(optionItemKey) >= 0) {
                localStorage.removeItem(key);
            }
        }
        optionItems = [];
    };

    /**
     * 在缓存中添加单个配置项
     * @param item {Object}
     */
    var _setOptionItem = function (item) {
        var localStorage = _getLocalStorage();
        for (var key in item) {
            localStorage.setItem(optionItemKey + key, item[key]);

            var obj = {};
            obj[optionItemKey + key] = item[key];
            optionItems.push(obj);
            return obj;
        }
    };

    /**
     * 从缓存中初始化所有配置项数据源
     */
    var _initOptionItemUrls = function () {
        var localStorage = _getLocalStorage();
        for (var key in localStorage) {
            if (key.indexOf(optionItemUrlKey) >= 0) {
                var urlObject = localStorage.getItem(key);
                var item = {};
                item[key] = urlObject;
                optionItemUrls.push(item);
            }
        }
    };

    /**
     * 从缓存中删除所有配置项数据源
     */
    var _removeOptionItemUrls = function () {
        var localStorage = _getLocalStorage();
        for (var key in localStorage) {
            if (key.indexOf(optionItemUrlKey) >= 0) {
                localStorage.removeItem(key);
            }
        }
        optionItemUrls = [];
    };

    /**
     * 在缓存中添加单个配置项数据源
     * @param item {Object}
     */
    var _setOptionItemUrl = function (item) {
        var localStorage = _getLocalStorage();
        for (var key in item) {
            localStorage.setItem(optionItemUrlKey + key, item[key]);

            var obj = {};
            obj[optionItemUrlKey + key] = item[key];
            optionItemUrls.push(obj);
            return obj;
        }
    };

    /**
     * 获取HTML5缓存原始对象
     * return {windows.localStorage}
     */
    var _getLocalStorage = function () {
        return window.localStorage;
    };

    /**
     * 将这些配置项保存到background-page，这样才能对每个页面生效
     * @param {Object} items {key:value}
     */
    var _saveOptionItemByBgPage = function (items) {
        for (var key in items) {
            window.localStorage.setItem(key, items[key]);
        }
    };

    var _getOptionItemByBgPage = function (items) {
        var rst = {};
        for (var i = 0, len = items.length; i < len; i++) {
            /**
             * 获取某一项配置
             * @param {String} optName 配置参数名
             */
            for (var key in items[i]) {
                rst[key] = window.localStorage.getItem(key);
            }
        }
        return rst;
    };

    /**
     * 向background-page发送请求，提取配置项
     * @param {Object} items
     * @param {Function} 回调方法
     */
    var _goGetOptions = function (items, callback) {
        chrome.extension.sendMessage({
            type: MSG_TYPE.GET_OPTIONS,
            items: items
        }, callback);
    };

    /**
     * 向background-page发送请求，保存配置项
     * @param {Object} items
     */
    var _goSetOptions = function (items) {
        chrome.extension.sendMessage({
            type: MSG_TYPE.SET_OPTIONS,
            items: items
        });
    };

    /**
     * 由background-page触发
     * @param {Object} items
     * @param {Object} callback
     */
    var _doGetOptions = function (items, callback) {
        if (callback && typeof callback == 'function') {
            callback.call(null, _getOptionItemByBgPage(items));
        }
    };

    /**
     * 由background-page触发
     * @param {Object} items
     */
    var _doSetOptions = function (items) {
        _saveOptionItemByBgPage(items);
    };

    var _getOptionItem = function (optName) {
        return _getOptionItemByBgPage([optName])[optName];
    };

    /**
     * 保存启动项
     */
    var _save_opt_form_start = function () {

        // 删除全部缓存
        // 删除所有配置项数据源
        _removeOptionItemUrls();
        // 删除所有配置项
        _removeOptionItems();

        // 添加到缓存
        // 添加配置项数据源
        $('.datasource').each(function () {
            // 获取数据源输入框的每一项URL和选中状态
            var checked = $(this).children('input[type=checkbox]').is(':checked');
            var inputUrl = $(this).children('input[type=text]').val();
            if (checked && inputUrl.length > 0) {
                // 构造对象
                var key = inputUrl;
                var item = {};
                item[key] = inputUrl;

                // 发送消息并添加到缓存，冗余添加多了一次缓存
                _goSetOptions(_setOptionItemUrl(item));
            }
        });
        // 添加配置项
        $('input[type=checkbox][name=checkbox_tool]').each(function () {
            if ($(this).is(':checked')) {
                // 构造对象，由于缓存只支持String，所以只能转，获取时需要使用JSON.parse获取对象
                var obj = JSON.stringify({
                    url: $(this).next().children().attr('href'),
                    target: $(this).next().children().attr('target'),
                    name: $(this).next().children().attr('name'),
                    description: $(this).next().children().attr('description'),
                    sort: $(this).next().children().attr('sort'),
                    id: $(this).next().children().attr('id'),
                    type_id: $(this).parent().children().first().attr('id'),
                    type_name: $(this).parent().children().first().attr('type'),
                    type_description: $(this).parent().children().first().attr('description'),
                    type_sort: $(this).parent().children().first().attr('sort')
                });
                var key = $(this).next().children().attr('href');
                var item = {};
                item[key] = obj;

                // 发送消息并添加到缓存，冗余添加多了一次缓存
                _goSetOptions(_setOptionItem(item));
            }
        });
    };

    /**
     * 显示启动项
     */
    var _show_opt_form_start = function () {
        _goGetOptions(optionItems, function (opts) {
            // 初始化数据源
            _initDatasourceUrl();
            // 进行各项展示及选中状态
            _initDatasource(opts);
        })
    };

    /**
     * 关闭配置页面
     */
    var _closeTab = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            chrome.tabs.remove(tab.id);
        });
    };

    /**
     * 事件绑定
     */
    var _bindEvent = function () {

        //给保存按钮注册事件
        $('#btn_close').click(function () {
            //关闭当前tab
            _closeTab();
        });

        //给保存按钮注册事件
        $('#btn_save').click(function () {

            //保存各个值
            _save_opt_form_start();

            alert('恭喜，ToolLink助手-配置修改成功!');

            //关闭当前tab
            _closeTab();

            e.preventDefault();
            e.stopPropagation();
        });

        // 绑定数据源URL选择事件
        $('#opt_start #opt_form_start ul li fieldset div.datasource input[type=checkbox]').live('change', function () {
            // 清除所有页面上的配置项
            $('#opt_start #opt_form_start ul li:last fieldset fieldset').remove();
            // 重新初始化配置项
            _initDatasource(_getOptionItemByBgPage(optionItems));
        });

        // 绑定数据源URL事件
        // 增加
        $('#opt_start #opt_form_start ul li fieldset div.datasource .add').live('click', function () {
            var outhtml = template2_setdata($('#tool_template_new_datasource_content').html(), {});
            $('#opt_start #opt_form_start ul li fieldset div.datasource:last').after(outhtml);
        });
        // 删除
        $('#opt_start #opt_form_start ul li fieldset div.datasource .delete').live('click', function () {
            // 判断是否最后一个
            if ($(this).parent().parent().find('.datasource').size() == 1) {
                alert('至少要保留1个数据源！');
                return;
            }
            // 取消前面的选择按钮并触发选择事件
            var checkbox = $(this).parent().children().first();
            if ($(checkbox).is(':checked')) {
                $(checkbox).trigger("click");
                $(checkbox).trigger("change");
            }
            // 最后清除元素
            $(this).parent().remove();
        });
    };

    /**
     * 初始化缓存的数据源URL
     */
    var _initDatasourceUrl = function () {
        // 清除所有数据源输入框
        if (optionItemUrls.length > 0) {
            $('#opt_start #opt_form_start ul li fieldset div.datasource').remove();
        }
        $.each(optionItemUrls, function (i, item) {
            for (var key in item) {
                var url = item[key];
                var outhtml = template2_setdata($('#tool_template_new_datasource_content').html(), {
                    checked: 'checked',
                    url: url
                });
                $('#opt_start #opt_form_start ul li:first fieldset').append(outhtml);
            }
        });
    };

    /**
     * 加载数据源中的每一个配置项
     */
    var _initDatasource = function (opts) {
        // 数量
        var count = 0;
        $('.datasource').each(function () {
            // 获取数据源输入框的每一项URL和选中状态
            var checked = $(this).children('input[type=checkbox]').is(':checked');
            var inputUrl = $(this).children('input[type=text]').val();
            if (checked && inputUrl.length > 0) {

                // 根据数据源URL获取数据
                $.getJSON(inputUrl, null, function (data) {
                    // 排序方法
                    function jsonSort(a, b) {
                        return a.sort - b.sort;
                    }
                    // 第一层排序（类型）
                    data = data.sort(jsonSort);
                    for (var i = 0; i < data.length; i++) {
                        // 第二层排序（类型下的每一项）
                        data[i].items = data[i].items.sort(jsonSort);

                        // 遍历每一项并判断选中状态
                        for (var j = 0; j < data[i].items.length; j++) {
                            // 比对存储在缓存中的值
                            for (var key in opts) {
                                if (data[i].items[j].url == JSON.parse(opts[key]).url) {
                                    data[i].items[j].checked = 'checked';
                                }
                            }
                        }

                        // 渲染HTML
                        if (data != null) {
                            var outhtml = template2_setdata($('#tool_template_content').html(), data[i]);
                            // HTML结构特殊处理
                            if (count == 0 && i == 0) {
                                $('#opt_start #opt_form_start ul li:last fieldset legend').after(outhtml);
                            } else {
                                $('#opt_start #opt_form_start ul li:last fieldset:last').after(outhtml);
                            }
                        }

                        // 网络正常返回后自增1
                        count++;
                    }
                }).error(function () {
                    alert('网络异常，请重新加载！');
                });
            }
        });
    };

    /**
     * 初始化各个配置项
     */
    var _initOptions = function () {
        _initOptionItems();
        _initOptionItemUrls();
        _show_opt_form_start();
    };

    /**
     * 初始化
     */
    var _init = function () {
        _bindEvent();
        _initOptions();
    };

    return {
        optionItems: optionItems,
        init: _init,
        doSetOptions: _doSetOptions,
        doGetOptions: _doGetOptions,
        getOptionItem: _getOptionItem,
        getOptions: _goGetOptions,
        setOptions: _goSetOptions
    };
})();