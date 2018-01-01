function template_setdata(template, data) {
    try {
        if (!!data && '[object Array]' == Object.prototype.toString.call(data)) {//数组    
            var out = '';
            for (var obj in data) {
                var tempout = template;
                for (var key in data[obj]) {
                    tempout = tempout.replace(/\{\{(\S+)\}\}/g,
                        function (m, i, j) {
                            return (data[obj])[i];
                        });
                }
                out += tempout;
            }
            return out;
        } else if (!!data && '[object Object]' == Object.prototype.toString.call(data)) {//对象
            for (var key in data) {
                template = template.replace(/\{\{(\S+)\}\}/g,
                    function (m, i, j) {
                        return data[i];
                    });
            }
            return template;
        } else {//不做处理
            return template;
        }
    } catch (e) {
        console.log(e);
        return template;
    }
}

function template2_setdata(template, data) {
    var html = template;
    var result = "var p=[];with(data){ p.push('"//加入with设置作用域
        + html.replace(/[\r\n\t]/g, " ")//换行去掉
            .replace(/<#=(.*?)#>/g, "');p.push($1);p.push('")//<#=xxx#> => ');p.push(xxx);p.push('
            .replace(/<#/g, "');")//<# => ');
            .replace(/#>/g, "p.push('")//#> => p.push('
        + " ');}return p.join('');";//最后连接成一条字符串返回
    var func = new Function('data', result);//设置Function
    return func(data);
}