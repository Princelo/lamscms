const languages = [{
    content: '繁體中文', value: 'cn'
}, {
    content: 'English', value: 'en'
},{
    content: '简体中文', value: 'cn_simp'
}
];
const cn = {
    "Title": "標題",
    "Name": "名稱",
    "Headline": "置頂",
    "Priority": "排序權重",
    "Published": "是否發佈",
    "Preview": "簡介",
    "Avatar": "縮略圖",
    "Category": "欄目",
    "Announcement": "公告",
    "News": "新聞",
    "Content": "內容",
    "Tags": "標籤",
    "Add Tags": "添加標籤",
    "Save": "保存",
    "Reset": "重置",
    "- Select an option -": "-請選擇-",
    "Default": "缺省",
    "Mobile": "移動端",
    "Basic Settings": "基礎設定",
    "Site Settings": "網站設定",
    "Category Settings": "柵目設定",
    "User Center": "用戶中心",
    "Site Manager": "管理員",
    "Change Password": "密碼修改",
    "Content Management": "內容管理",
    "Articles": "文章",
    "Gallery": "畫廊",
    "Trash": "廢紙籮",
    "Widget Management": "小部件管理",
    "Widget List": "小部件列表",
    "Create Widget": "新建小部件",
    "Log": "日誌",
    "File Management": "檔案管理",
    "File Browser": "檔案瀏覽器",
    "Home": "主頁",
    "Visit our website!": "訪問網站看看！",
    "Website Settings": "網站設定",
    "Website Address": "網站網址",
    "Website Title": "網站標題",
    "Website Subtitle": "網站副標題",
    "Keywords": "關鍵詞",
    "Description": "描述",
    "Categories Settings": "柵目設定",
    "Code Template": "模板編碼",
    "Template List": "模板列表",
    "Create Template": "新建模板",
    "Standalone Pages": "獨立頁面",
    "Standalone Page List": "獨立頁面列表",
    "Create Standalone Page": "新建獨立頁面",
    "Edit Category": "編緝柵目",
    "Category Title": "柵目標題",
    "Category Code": "柵目編號",
    "Category Type": "柵目類型",
    "Contains Content": "葉子柵目",
    "While this setting turns on, articles, images or other info would be added to this category. And this setting of the category can’t be changed in future."
    :   "文章、圖片等內容只能添加到葉子柵目下，保存後不能變更該設定",
    "List Page Template": "列表頁模板",
    "Detail Page Template": "詳情頁模板",
    "Hidden": "隱藏",
    'System Admin': "系統管理員",
};
const cn_simp = {
    "Title": "标题",
    "Name": "名称",
    "Headline": "置顶",
    "Priority": "排序权重",
    "Published": "是否发布",
    "Preview": "简介",
    "Avatar": "缩略图",
    "Category": "栏目",
    "Announcement": "公告",
    "News": "新闻",
    "Content": "内容",
    "Tags": "标签",
    "Add Tags": "添加标签",
    "Save": "保存",
    "Reset": "重置",
    "- Select an option -": "-请选择-",
    "Default": "缺省",
    "Mobile": "移动端",
    "Basic Settings": "基础设置",
    "Site Settings": "网站设置",
    "Category Settings": "栅目设置",
    "User Center": "用户中心",
    "Site Manager": "管理员",
    "Change Password": "密码修改",
    "Content Management": "内容管理",
    "Articles": "文章",
    "Gallery": "画廊",
    "Trash": "回收站",
    "Widget Management": "小部件管理",
    "Widget List": "小部件列表",
    "Create Widget": "新建小部件",
    "Log": "日志",
    "File Management": "文件管理",
    "File Browser": "文件浏览器",
    "Home": "主页",
    "Visit our website!": "访问网站看看！",
    "Website Settings": "网站设置",
    "Website Address": "网站网址",
    "Website Title": "网站标题",
    "Website Subtitle": "网站副标题",
    "Keywords": "关键词",
    "Description": "描述",
    "Categories Settings": "栅目设置",
};

const i18n = (key, language) => {
    if (language === 'cn') {
        if (key in cn) {
            return cn[key];
        }
        return key;
    }
    if (language === 'cn_simp') {
        if (key in cn_simp) {
            return cn_simp[key];
        }
        return key;
    }
    return key;
}

export function getLanguages() {
    return languages;
}

export function getLanguageName(language) {
    for (let i = 0; i < languages.length; i++) {
        if (language === languages[i].value) {
            return languages[i].content;
        }
    }
}

export function getLanguageCode(code) {
    if ('cn' === code) return 'zh-tw';
    if ('cn_simp' === code) return 'zh-cn';
    return 'en';
}

export function translateWithLanguage(language) {
    return key => {
        return i18n(key, language)
    }
}
