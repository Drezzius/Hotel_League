Handlebars.registerHelper({
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function () {
        return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " "
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(" "))
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, ' ')
    },
});