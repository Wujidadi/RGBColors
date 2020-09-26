/*
 *==================================================
 * 參數
 *==================================================
 */

const dataFile = '/data/RGBColor.json';


/*
 *==================================================
 * Vue.js
 *==================================================
 */

let vue = new Vue(
{
    el: '#content',
    data:
    {
        colorData: [],

        originalColorData: [],

        columns: [
            { class: 'var sortable', sortFlag: 0 },     // 0: 變數名稱
            { class: 'en sortable',  sortFlag: 0 },     // 1: 英文名稱
            { class: 'ch sortable',  sortFlag: 0 },     // 2: 中文名稱
            { class: 'r sortable',   sortFlag: 0 },     // 3: R
            { class: 'g sortable',   sortFlag: 0 },     // 4: G
            { class: 'b sortable',   sortFlag: 0 },     // 5: B
        ]
    },
    methods:
    {
        colorBlock: function(data)
        {
            return `background: rgb(${data[3]}, ${data[4]}, ${data[5]})`;
        },

        rgbValue: function(data)
        {
            return `rgb(${data[3]}, ${data[4]}, ${data[5]})`;
        },

        sortData: function(index)
        {
            switch (this.columns[index].sortFlag)
            {
                case 0:
                    this.colorData.sort(function(a, b)
                    {
                        return a[index] < b[index] ? 1 : -1;
                    });
                    this.columns[index].class += ' asc';
                    this.columns[index].sortFlag++;
                    break;

                case 1:
                    this.colorData.sort(function(a, b)
                    {
                        return a[index] > b[index] ? 1 : -1;
                    });
                    this.columns[index].class = this.columns[index].class.replace(' asc', ' desc');
                    this.columns[index].sortFlag++;
                    break;

                case 2:
                    this.colorData = $.extend(true, [], this.originalColorData);    // 深拷貝
                    this.columns[index].class = this.columns[index].class.replace(/ (a|de)sc/g, '');
                    this.columns[index].sortFlag = 0;
                    break;
            }
        }
    },
    mounted: function()
    {
        let me = this;

        fetch(dataFile)
        .then(response => response.json())
        .then(response =>
        {
            this.colorData = response;
            this.originalColorData = $.extend(true, [], response);  // 深拷貝
        });
    }
});
