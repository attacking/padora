const superagent = require('superagent');
const isChinese = require('is-chinese');
const token = require('./token.js');
const dealresult = require('./deal.js');
const chalk = require('chalk');

const getResult = (input, spinner) => {
  const isCh = isChinese(input);
  var options = {};
  options.from = isCh ? 'zh-CN' : 'en';
  options.to = isCh ? 'en' : 'zh-CN';
  return token.get(input).then(function (tk) {
    //console.log(tk);
    let arg = {
      client: 't',
      sl: options.from,
      tl: options.to,
      hl: options.from,
      dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
      ie: 'UTF-8',
      oe: 'UTF-8',
      otf: 1,
      ssel: 0,
      tsel: 0,
      kc: 7,
      tk: tk.value,
      q: input
    }
    superagent.get('https://translate.google.cn/translate_a/single')
      .query(arg)
      .end(function (err, res) {
        spinner.stop(true);

        if (err || !res.ok) {
          console.log(chalk.redBright('query error:'), err + '');
        } else {
          console.log(chalk.greenBright(dealresult(res)));
        }
      });

  }, function (err) {
    console.log("get token err:" + err);
  });
}

module.exports = getResult
