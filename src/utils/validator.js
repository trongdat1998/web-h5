export default {
  /**
   * isMobilePhone
   * @param {String} mobile 手机号
   * @param {String} locale 默认en-us
   * @return {Boolean} true/false
   */
  isMobilePhone: (str, locale = "en-us") => {
    const phones = {
      "zh-cn": /^(\+?0?86\-?)?1[345789]\d{9}$/,
      "zh-tw": /^(\+?886\-?|0)?9\d{8}$/,
      "en-za": /^(\+?27|0)\d{9}$/,
      "en-au": /^(\+?61|0)4\d{8}$/,
      "en-hk": /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      "fr-fr": /^(\+?33|0)[67]\d{8}$/,
      "pt-pt": /^(\+351)?9[1236]\d{7}$/,
      "el-gr": /^(\+30)?((2\d{9})|(69\d{8}))$/,
      "en-gb": /^(\+?44|0)7\d{9}$/,
      "en-us": /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      "en-zm": /^(\+26)?09[567]\d{7}$/,
      "ru-ru": /^(\+?7|8)?9\d{9}$/,
      "nb-no": /^(\+?47)?[49]\d{7}$/,
      "nn-no": /^(\+?47)?[49]\d{7}$/
    };
    if (locale in phones) {
      return phones[locale].test(str);
    }
    return false;
  },
  /**
   * isEmail
   * @param {String} email 邮箱
   * @return {Boolean} true/false
   */
  isEmail: email => {
    const regexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regexp.test(email);
  },
  /**
   * isCreditCard
   * @param {Number} creditCard 信用卡卡号
   * @return {Boolean} true/false
   */
  isCreditCard: creditCard => {
    const regexp = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const sanitized = creditCard.replace(/[^0-9]+/g, "");
    if (!regexp.test(sanitized)) {
      return false;
    }
    let sum = 0,
      digit,
      tmpNum,
      shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += (tmpNum % 10) + 1;
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }
    return !!(sum % 10 === 0 ? sanitized : false);
  },
  /**
   * isNumeric 是否为数字
   * @param {Number} num
   */
  isNumeric: num => {
    return /^[-+]?[0-9]+$/.test(num);
  },
  /**
   * isInt 是否为整数
   * @param {Number} num
   */
  isInt: num => {
    return /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(num);
  },
  /**
   * isFloat 是否为浮点数
   * @param {Number} num
   */
  isFloat: num => {
    if (num === "" || num === ".") {
      return false;
    }
    // /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
    return /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(
      num
    );
  },
  /**
   * isIp
   */
  isIp: str => {
    if (str === "") {
      return false;
    }
    return /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/.test(
      str
    );
  }
};
