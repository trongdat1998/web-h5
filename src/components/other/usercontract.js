import React from "react";
import s from "./style.less";

class Agreement extends React.Component {
  constructor() {
    super();
    this.state = {
      title: {
        "zh-cn": "用户协议",
        "en-us": "Terms of User",
      },
      content: {
        "zh-cn": `
<br/>用户协议
<br/>BHPC.（以下称 “公司”）是一家根据马耳他共和国相关法律在马耳他共和国注册成立的公司，该公司运营网站https://www.nucleex.com（以下称“本网站”或“网站”），该网站是一个专门供用户进行数字资产交易和提供相关服务（以下称“该服务”或“服务”）的平台。为了本协议表述之方便，公司和该网站在本协议中合称使用“我们”或其他第一人称称呼。只要登录该网站的自然人或其他主体均为本网站的用户，本协议表述之便利，以下使用“您”或其他第二人称。为了本协议表述之便利，我们和您在本协议中合称为“双方”，我们或您单称为“一方”。本网站所有内容，为便利用户，可能提供多个语言版本，若有冲突或遗漏等情况，以中文内容为准。
<br/>重要提示：
<br/>我们在此特别提醒您：
<br/>1. 数字资产本身不由任何金融机构或公司或本网站发行；
<br/>2. 数字资产市场是全新的、未经确认的，而且可能不会增长；
<br/>3. 数字资产主要由投机者大量使用，零售和商业市场使用相对较少，数字资产交易存在极高风险，其全天不间断交易，没有涨跌限制，价格容易受庄家、全球政府政策的影响而大幅波动；
<br/>4. 如果公司根据其单方判断认为您违反了本协议，或者根据您所在管辖区域的法律本网站提供的服务或者您使用本网站提供的服务的行为是非法的，公司有权随时暂停或终止您的账户，或者暂停或终止您使用本网站提供的服务或数字资产交易。 禁止位于美国的任何人使用本网站提供的服务。
<br/>
<br/>数字资产交易有极高风险，并不适合绝大部分人士。您了解和理解此投资有可能导致部分损失或全部损失，所以您应该以能承受的损失程度来决定投资的金额。您了解和理解数字资产会产生衍生风险，所以如有任何疑问，建议先寻求理财顾问的协助。此外，除了上述提及过的风险以外，还会有未能预测的风险存在。您应慎重考虑并用清晰的判断能力去评估自己的财政状况及上述各项风险而作出任何买卖数字资产的决定，并承担由此产生的全部损失，我们对此不承担任何责任。
<br/>
<br/>
<br/>
<br/>
<br/>敬告您：
<br/>1. 您了解本网站仅作为您获取数字资产信息、寻找交易方、就数字资产的交易进行协商及开展交易的场所，本网站不参与您的任何交易，故您应自行谨慎判断确定相关数字资产及/或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。
<br/>2. 本网站的任何意见、消息、探讨、分析、价格、建议和其他资讯均是一般的市场评论，并不构成投资建议。我们不承担任何因依赖该资讯直接或间接而产生的损失，包括但不限于任何利润损失。
<br/>3. 本网站的内容会随时更改并不作另行通知，我们已采取合理措施确保网站资讯的准确性，但并不能保证其准确性程度，亦不会承担任何因本网站上的资讯或因未能链结互联网、传送或接收任何通知和信息时的延误或失败而直接或间接产生的损失。
<br/>4. 使用互联网形式的交易系统亦存有风险，包括但不限于软件，硬件和互联网链结的失败等。由于我们不能控制互联网的可靠性和可用性，我们不会对失真，延误和链结失败而承担任何责任。
<br/>5. https://www.bhpc.com为本网站唯一官方对外信息公布平台；
<br/>6. 本网站任何服务均不接受信用卡支付；
<br/>7.  禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动或违法行为，若发现任何涉嫌非法交易或违法行为，本站将采取各种可使用之手段，包括但不限于冻结账户，通知相关权力机关等，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。
<br/>8. 禁止使用本网站进行恶意操纵市场、不正当交易等一切不道德交易活动，若发现此类事件，本网站将对所有恶意操纵价格、恶意影响交易系统等不道德的行为采取警告、限制交易、关停账户等预防性地保护措施，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。
<br/>
<br/>一、总则
<br/>1.1 《用户协议》（以下称“本协议”或“本条款及条件”），由正文、《隐私条款》、《了解你的客户和反洗钱政策》以及本网站已经发布的或将来可能发布的各类规则、声明、说明等构成。
<br/>1.2 您在使用本网站提供的各项服务之前，应仔细阅读本协议，如有不理解之处或其他必要，请咨询专业律师。如您不同意本协议及/或随时对其的修改，请您立即停止使用本网站提供的服务或不再登录本网站。您一旦登录本网站、使用本网站的任何服务或任何其他类似行为即表示您已了解并完全同意本协议各项内容，包括本网站对本协议随时所做的任何修改。
<br/>1.3 您通过按照本网站的要求填写相关信息，并经过其他相关程序后成功注册可以成为本网站的会员（以下称“会员”），在进行注册过程中点击“同意”按钮即表示您以电子签署的形式与公司达成协议；或您在使用本网站过程中点击任何标有“同意”或类似意思的按钮的行为或以其他本网站允许的方式实际使用本网站提供的服务时，均表示您完全了解、同意且接受本协议项下的全部条款的约束，无您手写的书面签字就本协议对您的法律约束力无任何影响。
<br/>1.4 您成为本网站的会员后，您将获得一个会员帐号及相应的密码，该会员帐号和密码由会员负责保管；会员应当对以其您帐号进行的所有活动和事件负法律责任。
<br/>1.5 只有成为本网站的会员才可使用本网站提供的数字资产交易平台进行交易及享受其他本网站规定的只有会员才可获得的服务；会员外的其他您只有登录网站、浏览网站及其他本网站规定的可获得的服务。
<br/>1.6 通过注册和使用任何由本网站提供的服务和功能，您将被视为已阅读，理解并：
<br/>1.6.1 接受本协议所有条款及条件的约束。
<br/>1.6.2 您确认您已年满16周岁或根据不同的可适用的法律规定的具有可订立合同的法定年龄，您在本网站的注册、销售或购买、发布信息等接受本网站服务的行为应当符合对您有管辖权的主权国家或地区相关法律法规，并有充分的能力接受这些条款，并订立交易，使用本网站进行数字资产交易。
<br/>1.6.3 您保证交易中涉及到的属于您的数字资产均为合法取得并所有。
<br/>1.6.4 您同意您为您自身的交易或非交易行为承担全部责任和任何收益或亏损。1.6.5 您确认注册时提供的信息是真实和准确的。
<br/>1.6.6 您同意遵守任何有关法律的规定，就税务目的而言，包括报告任何交易利润。
<br/>1.6.7 您同意在任何时候不得从事或参与损害本网站或公司利益的行为或活动，无论是否与本网站提供的服务有关。
<br/>1.6.8 本协议只是就您与我们之间达成的权利义务关系进行约束，而并不涉及本网站用户之间与其他网站和您之间因数字资产交易而产生的法律关系及法律纠纷。
<br/>
<br/>二、协议修订
<br/>我们保留不时修订本协议、并以网站公示的方式进行公告、不再单独通知您的权利，变更后的协议会在本协议首页标注变更时间，一经在网站公布，立即自动生效。您应不时浏览及关注本协议的更新变更时间及更新内容，如您不同意相关变更，应当立即停止使用本网站服务；您继续使用本网站服务，即表示您接受并同意经修订的协议的约束。
<br/>
<br/>三、注册
<br/>3.1 注册资格
<br/>您确认并承诺：在您完成注册程序或以其他本网站允许的方式实际使用本网站提供的服务时，您应当是具备可适用的法律规定的可签署本协议及使用本网站服务应具有的能力的自然人、法人或其他组织。您一旦点击同意注册按钮，即表示您自身或您的有权代理人已经同意该协议内容并由其代理注册及使用本网站服务。若您不具备前述主体资格，则您及您的有权代理人应承担因此而导致的一切后果，且公司保留注销或永久冻结您账户，并向您及您的有权代理人追究责任的权利。
<br/>3.2 注册目的
<br/>您确认并承诺：您进行本网站注册并非出于违反法律法规或破坏本网站数字资产交易秩序的目的。
<br/>3.3注册流程
<br/>3.3.1 您同意根据本网站用户注册页面的要求提供有效电子邮箱、手机号码等信息，您可以使用您提供或确认的邮箱、手机号码或者本网站允许的其它方式作为登录手段进入本网站。如有必要，按照不同法域相关法律法规的规定，您必须提供您的真实姓名、身份证件等法律法规及隐私条款及反洗钱条款规定的相关信息并不断更新注册资料，符合及时、详尽、准确的要求。所有原始键入的资料将引用为注册资料。您应对该等信息的真实性、完整性和准确性负责，并承担因此产生的任何直接或间接损失及不利后果。
<br/>3.3.2 如您所在主权国家或地区的法律法规、规则、命令等规范对手机号码有实名要求，您同意提供注册的手机号码是经过实名登记的，如您不按照规定提供，因此给您带来的任何直接或间接损失及不利后果均应由您承担。
<br/>3.3.3您合法、完整并有效提供注册所需信息并经验证，有权获得本网站账号和密码，您获得本网站账号及密码时视为注册成功，可在本网站进行会员登录。
<br/>3.3.4 您同意接收本网站发送的与本网站管理、运营相关的电子邮件和/或短消息。
<br/>
<br/>四、服务
<br/>本网站只为您通过本网站进行数字资产交易活动（包括但不限于数字资产交易等服务）提供网络交易平台服务，本网站并不作为买家或卖家参与买卖数字资产行为本身；本网站不提供任何国家法定货币充入和提取的相关服务。
<br/>4.1 服务内容
<br/>4.1.1 您有权在本网站浏览数字资产各项产品的实时行情及交易信息、有权通过本网站提交数字资产交易指令并完成数字资产交易。
<br/>4.1.2 您有权在本网站查看其本网站会员账号下的信息，有权应用本网站提供的功能进行操作。
<br/>4.1.3 您有权按照本网站发布的活动规则参与本网站组织的网站活动。
<br/>4.1.4 本网站承诺为您提供的其他服务。
<br/>4.2.服务规则 您承诺遵守下列本网站服务规则：
<br/>4.2.1 您应当遵守法律法规、规章、及政策要求的规定，保证账户中所有数字资产来源的合法性，不得在本网站或利用本网站服务从事非法或其他损害本网站或第三方权益的活动，如发送或接收任何违法、违规、侵犯他人权益的信息，发送或接收传销材料或存在其他危害的信息或言论，未经本网站授权使用或伪造本网站电子邮件题头信息等。
<br/>4.2.2 您应当遵守法律法规并妥善使用和保管其本网站账号及登录密码、资金密码、和其注册时绑定的手机号码、以及手机接收的手机验证码的安全。您对使用其本网站账号和登录密码、资金密码、手机验证码进行的任何操作和后果承担全部责任。当您发现本网站账号、登录密码、或资金密码、验证码被未经其授权的第三方使用，或存在其他账号安全问题时，应立即有效通知本网站，要求本网站暂停本网站账号的服务。本网站有权在合理时间内对您的该等请求采取行动，但本网站对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。您在未经本网站同意的情况下不得将本网站账号以赠与、借用、租用、转让或其他方式处分给他人。
<br/>4.2.3 您同意您对您的本网站的账号、密码下发生的所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续签协议或购买服务等）承担责任。
<br/>4.2.4 您在本网站进行数字资产交易时不得恶意干扰数字资产交易的正常进行、破坏交易秩序；不得以任何技术手段或其他方式干扰本网站的正常运行或干扰其他用户对本网站服务的使用；不得以虚构事实等方式恶意诋毁本网站的商誉。4.2.5 如您因网上交易与其他用户产生纠纷的，不得通过司法或行政以外的途径要求本网站提供相关资料。
<br/>4.2.6 您在使用本网站提供的服务过程中，所产生的应纳税赋，以及一切硬件、软件、服务及其它方面的费用，均由您独自判断和承担。
<br/>4.2.7 您应当遵守本网站不时发布和更新的本协议以及其他服务条款和操作规则，有权随时终止使用本网站提供的服务。
<br/>4.3.产品规则
<br/>4.3.1交易产品规则 您承诺在其进入本网站交易，通过本网站与其他用户进行交易的过程中良好遵守如下交易规则。
<br/>4.3.1.1 浏览交易信息
<br/>您在本网站浏览交易信息时，应当仔细阅读交易信息中包含的全部内容，包括但不限于价格、委托量、手续费、买入或卖出方向， 您完全接受交易信息中包含的全部内容后方可点击按钮进行交易。
<br/>4.3.1.2 提交委托
<br/>在浏览完交易信息确认无误之后您可以提交交易委托。您提交交易委托后，即您授权本网站代理您进行相应的交易撮合，本网站在有满足您委托价格的交易时将会自动完成撮合交易而无需提前通知您。
<br/>4.3.1.3 查看交易明细
<br/>您可以通过管理中心的交易明细中查看相应的成交记录，确认自己的详情交易记录。
<br/>4.3.1.4 撤销/修改委托，在委托未达成交易之前，您有权随时撤销或修改委托。
<br/>
<br/>五、本网站的权利和义务
<br/>5.1 如您不具备本协议约定的注册资格，则本网站有权拒绝您进行注册，对已注册的，本网站有权注销您的会员账号，本网站保留向您或您的有权代理人追究责任的权利。同时，本网站保留其他任何情况下决定是否接受您注册的权利
<br/>5.2 本网站发现您或您的关联账户使用者根据本网站自己的判断不适合高风险投资时，有权中止或终止您的账户以及所有关联账户的使用。
<br/>5.3 本网站发现账户使用者并非账户初始注册人时，有权中止或终止该账户的使用。
<br/>5.4 本网站通过技术检测、人工抽检等检测方式合理怀疑您提供的信息错误、不实、失效或不完整时，有权通知您更正、更新信息或中止、终止为其提供本网站服务。
<br/>5.5 本网站有权在发现本网站上显示的任何信息存在明显错误时，对信息予以更正。
<br/>5.6 本网站保留随时修改、中止或终止本网站服务的权利，本网站行使修改或中止服务的权利不需事先告知您；本网站终止本网站一项或多项服务的，终止自本网站在网站上发布终止公告之日生效。
<br/>5.7 本网站应当采取必要的技术手段和管理措施保障本网站的正常运行，并提供必要、可靠的交易环境和交易服务，维护数字资产交易秩序。
<br/>5.8 如您连续一年未使用本网站会员账号和密码登录本网站，则本网站有权注销您的本网站账号。账号注销后，本网站有权将相应的会员名开放给其他您注册使用。
<br/>5.9 本网站通过加强技术投入、提升安全防范等措施保障您的数字资产的安全，有义务在您账户出现可以预见的安全风险时提前通知您。
<br/>5.10 本网站有权随时删除本网站内各类不符合法律法规或本网站规定等的内容信息，本网站行使该等权利不需提前通知您。
<br/>5.11 本网站有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，向您要求提供更多的信息或资料等，并采取合理的措施，以符合当地的规范之要求，您有义务配合；本网站有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，暂停或永久停止对您的开放本网站及其部分或全部服务。
<br/>
<br/>六、赔偿
<br/>6.1 在任何情况下，我们对您的直接损害的赔偿责任均不会超过您从使用本网站服务产生的为期三（ 3）个月的总费用。
<br/>6.2 如您发生违反本协议或其他法律法规等情况，您须向我们至少赔偿200万美元及承担由此产生的全部费用（包括律师费等），如不够弥补实际损失，您须补全。
<br/>
<br/>七、寻求禁令救济的权利
<br/>我们和您均承认普通法对违约或可能违约情况的救济措施是可能是不足以弥补我们遭受的全部损失的，故非违约方有权在违约或可能违约情况下寻求禁令救济以及普通法或衡平法允许的其他所有的补救措施。
<br/>
<br/>八、责任限制与免责
<br/>8.1 您了解并同意，在任何情况下，我们不就以下各事项承担责任：
<br/>8.1.1 收入的损失；
<br/>8.1.2 交易利润或合同损失；
<br/>8.1.3 业务中断
<br/>8.1.4 预期可节省的货币的损失；
<br/>8.1.5 信息的损失；
<br/>8.1.6 机会、商誉或声誉的损失；
<br/>8.1.7 数据的损坏或损失；
<br/>8.1.8 购买替代产品或服务的成本；
<br/>8.1.9 任何由于侵权（包括过失）、违约或其他任何原因产生的间接的、特殊的或附带性的损失或损害，不论这种损失或损害是否可以为我们合理预见；不论我们是否事先被告知存在此种损 失或损害的可能性。
<br/>8.1.1 条至8.1.9条均是彼此独立的。
<br/>8.2 您了解并同意，我们不对因下述任一情况而导致您的任何损害赔偿承担责任：
<br/>8.2.1 我们有合理的理由认为您的具体交易事项可能存在重大违法或违约情形。8.2.2 我们有合理的理由认为您在本网站的行为涉嫌违法或不道德。
<br/>8.2.3 通过本网站服务购买或获取任何数据、信息或进行交易等行为或替代行为产生的费用及损失。
<br/>8.2.4 您对本网站服务的误解。
<br/>8.2.5 任何非因我们的原因而引起的与本网站提供的服务有关的其它损失。
<br/>8.3 我们对由于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、天气原因、意外事故、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、银行或其他合作方原因、数字资产市场崩溃、政府行为、 司法或行政机关的命令、其他不在我们可控范围内或我们无能力控制的行为或第三方的原因而造成的不能服务或延迟服务，以及造成的您的损失，我们不承担任何责任。
<br/>8.4 我们不能保证本网站包含的全部信息、程序、文本等完全安全，不受任何病毒、木马等恶意程序的干扰和破坏，故您登录、使用本网站任何服务或下载及使用该下载的任何程序、信息、数据等均是您个人的决定并自行承担风险及可能产生的损失。
<br/>8.5 我们对本网站中链接的任何第三方网站的任何信息、产品及业务及其他任何形式的不属于我们的主体的内容等不做任何保证和承诺，您如果使用第三方网站提供的任何服务、信息及产品等均为您个人决定且承担由此产生的一切责任。
<br/>8.6 我们对于您使用本网站服务不做任何明示或暗示的保证，包括但不限于本网站提供服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，我们也不对本网站提供的服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、质量、稳定、完整和及时性作出任何承诺和保证。是否登录或使用本网站提供的服务是您个人的决定且自行承担风险及可能产生的损失。我们对于数字资产的市场、价值及价格等不做任何明示或暗示的保证，您理解并了解数字资产市场是不稳定的，价格和价值随时会大幅波动或崩盘，交易数字资产是您个人的自由选择及决定且自行承担风险及可能产生的损失。
<br/>8.7 本协议中规定的我们的保证和承诺是由我们就本协议和本网站提供的服务的唯一保证和陈述，并取代任何其他途径和方式产生的保证和承诺，无论是书面的或口头的，明示的或暗示的。所有这些保证和陈述仅仅代表我们自身的承诺和保证，并不保证任何第三方遵守本协议中的保证和承诺。
<br/>8.8 我们并不放弃本协议中未提及的在法律适用的最大范围内我们享有的限制、免除或抵销我们损害赔偿责任的任何权利。
<br/>8.9 您注册后即表示认可我们按照本协议中规定的规则进行的任何操作，产生的任何风险均由您承担。
<br/>
<br/>九、协议的终止
<br/>9.1 本网站有权依据本协议约定注销您的本网站账号，本协议于账号注销之日终止。
<br/>9.2 本网站有权依据本协议约定终止全部本网站服务，本协议于本网站全部服务终止之日终止。
<br/>9.3 本协议终止后，您无权要求本网站继续向其提供任何服务或履行任何其他义务，包括但不限于要求本网站为您保留或向您披露其原本网站账号中的任何信息， 向您或第三方转发任何其未曾阅读或发送过的信息等。
<br/>9.4 本协议的终止不影响守约方向违约方要求其他责任的承担。
<br/>
<br/>十、知识产权
<br/>10.1 本网站所包含的全部智力成果包括但不限于网站标志、数据库、网站设计、文字和图表、软件、照片、录像、音乐、声音及其前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本) 的知识产权权利均归本网站所有。您不得为商业目的复制、更改、拷贝、发送或使用前述任何材料或内容。
<br/>10.2 本网站名称中包含的所有权利 (包括但不限于商誉和商标、标志) 均归公司所有。
<br/>10.3 您接受本协议即视为您主动将其在本网站发表的任何形式的信息的著作权， 包括但不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权 以及应当由著作权人享有的其他可转让权利无偿独家转让给本网站所有，本网站有权利就任何主体侵权单独提起诉讼并获得全部赔偿。 本协议效力及于您在本网站发布的任何受著作权法保护的作品内容， 无论该内容形成于本协议签订前还是本协议签订后。
<br/>10.4 您在使用本网站服务过程中不得非法使用或处分本网站或他人的知识产权权利。您不得将已发表于本网站的信息以任何形式发布或授权其它网站（及媒体）使用。
<br/>10.5 您登录本网站或使用本网站提供的任何服务均不视为我们向您转让任何知识产权。
<br/>
<br/>十一、信息保护
<br/>11.1 适用范围
<br/>11.1.1 在您注册网站账号或者使用账户时，您根据本网站要求提供的个人注册信息，包括但不限于电话号码、邮箱信息、身份证件信息。
<br/>11.1.2 在您使用本网站服务时，或访问本网站网页时，本网站自动接收并记录的您浏览器上的服务器数值，包括但不限于IP地址等数据及您要求取用的网页记录。
<br/>11.1.3 本网站收集到的您在本网站进行交易的有关数据，包括但不限于交易记录。
<br/>11.1.4本网站通过合法途径取得的其他您个人信息。
<br/>11.2 信息使用
<br/>11.2.1 不需要您额外的同意，您在本网站注册成功即视为您同意本网站收集并使用其在本网站的各类信息，如11.1条所列，您了解并同意，本网站可以将收集的您信息用作包括但不限于下列用途：
<br/>11.2.1.1 向您提供本网站服务；
<br/>11.2.1.2 基于主权国家或地区相关主管部门的要求向相关部门进行报告；
<br/>11.2.1.3 在您使用本网站服务时，本网站将您的信息用于身份验证、客户服务、安全防范、诈骗监测、市场推广、存档和备份用途，或与第三方合作推广网站等合法用途，确保本网站向您提供的产品和服务的安全性；
<br/>11.2.1.4 帮助本网站设计新产品及服务，改善本网站现有服务目的而进行的信息收集和整理
<br/>11.2.1.5为了使您了解本网站服务的具体情况，您同意本网站向其发送营销活动通知、商业性电子信息以及提供与您相关的广告以替代普遍投放的广告；
<br/>11.2.1.6 本网站为完成合并、分立、收购或资产转让而将您的信息转移或披露给任何非关联的第三方；
<br/>11.2.1.7 软件认证或管理软件升级；
<br/>11.2.1.8 邀请您参与有关本网站服务的调查；
<br/>11.2.1.9 用于和政府机关、公共事务机构、协会等合作的数据分析；
<br/>11.2.1.10 用作其他一切合法目的以及经您授权的其他用途。
<br/>11.2.2 本网站不会向其他任何人出售或出借您的个人信息，除非事先得到您的许可。本网站也不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。
<br/>11.3 本网站对所获得的客户身份资料和交易信息等进行保密，不得向任何单位和个人提供客户身份资料和交易信息，应相关主权国家或地区法律法规、政令、命令等规定要求本网站提供的除外。
<br/>
<br/>十二、计算所有的交易计算结果都经过我们的核实，所有的计算方法都已经在网站上公示，但是我们不能保证网站的使用不会受到干扰或没有误差。
<br/>
<br/>十三、出口控制您理解并承认，根据马耳他共和国相关法律，您不得将本网站上的任何材料（包括软件）出口、再出口、进口或转移，故您保证不会主动实施或协助或参与任何上述违反法规的出口或有关转移或其他违反适用的法律和法规的行为；如发现此类情形，会向我们积极报告并协助我们处理。
<br/>
<br/>十四、转让本协议中约定的权利及义务同样约束从该权利义务中获取到利益的各方的受让人，继承人，遗嘱执行人和管理员。您不得在我们不同意的前提下转让给任何第三人，但我们可随时将我们在本协议中的权利和义务转让给任何第三人，并给予您提前30天的通知。
<br/>
<br/>十五、可分割性如本协议中的任何条款被任何有管辖权的法院认定为不可执行的，无效的或非法的，并不影响本协议的其余条款的效力。
<br/>
<br/>十六、非代理关系本协议中的任何规定均不可被认为创造了、暗示了或以其他方式将我们视为您的代理人、受托人或其他代表人，本协议有其他规定的除外。
<br/>十七、弃权我们或您任何一方对追究本协议约定的违约责任或其他责任的弃权并不能认定或解释为对其他违约责任的弃权；未行使任何权利或救济不得以任何方式被解释为对该等权利或救济的放弃。
<br/>
<br/>十八、标题所有标题仅供协议表述方便，并不用于扩大或限制该协议条款的内容或范围。
<br/>
<br/>十九、适用法律本协议全部内容均为根据马耳他共和国法律订立的合同，其成立、解释、内容及执行均适用马耳他共和国相关法律规定；任何因或与本协议约定的服务有关而产生的索赔或诉讼，都应依照马耳他共和国的法律进行管辖并加以解释和执行。为避免疑义，这一条款明确适用于任何针对我们的侵权索赔。任何针对我们或者是和我们有关的索赔或诉讼的管辖法院或诉讼地均在马耳他共和国。您无条件地获得在马耳他共和国法院进行诉讼和上诉的排他性的管辖权。您也无条件地同意与本协议款有关的争议或问题或产生的任何索赔请求和诉讼的发生地或法院均排他性得在马耳他共和国，如有本网站其他业务对管辖有专门约定从其约定。不方便法院的原则不适用于根据本服务条款的选择的法院。
<br/>
<br/>二十、协议的生效和解释
<br/>20.1 本协议于您点击本网站注册页面的同意注册并完成注册程序、获得本网站账号和密码时生效，对本网站和您均具有约束力。
<br/>20.2 本协议的最终解释权归本网站所有。
<br/>了解你的客户和反洗钱政策
<br/>
<br/>一、导言
<br/>1.1 我们保证审慎遵守“了解你的客户”和反洗钱相关的法律法规且不得故意违反该《了解你的客户和反洗钱政策》。在我们合理控制的范围内我们将采取必要的措施和技术为您提供安全的服务，尽可能使您免于遭受犯罪嫌疑人的洗钱行为带来的损失。
<br/>1.2 我们的了解你的客户和反洗钱政策是一个综合性的国际政策体系，包括您隶属的不同法律辖区的了解你的客户和反洗钱政策。我们健全合规的框架确保我们在本地和全球层面均符合监管要求和监管水平，并确保本网站持续性运行。
<br/>
<br/>二、了解你的客户和反洗钱政策如下：
<br/>2.1 颁布了解你的客户和反洗钱政策并时时更新以满足相应的法律法规规定的标准；
<br/>2.2 颁布和更新运行本网站的一些指导原则和规则，且我们的员工将按照该原则和规则的指导提供服务；
<br/>2.3 设计并完成内部监测和控制交易的程序，如以严格的手段验证身份，安排组建专业团队专门负责反洗钱工作；
<br/>2.4 采用风险预防的方法对客户进行尽职调查和持续的监督;
<br/>2.5 审查和定期检查已发生的交易;
<br/>2.6 向主管当局报告可疑交易;
<br/>2.7 身份证明文件、地址证明文件和交易记录的证明文件将会维持至少六年，如被提交给监管部门，恕不另行通知您。
<br/>2.8 整个交易过程中，信用卡被禁止使用；
<br/>
<br/>三、身份信息与核实确认
<br/>3.1 身份信息
<br/>3.1.1 根据不同的司法管辖区的不同规定及不同的实体类型，我们收集的您的信息内容可能不一致，原则上将向注册的个人收集以下信息：
<br/>个人基本信息：您的姓名，住址（及永久地址，如果不同） ，出生日期及国籍等可获得的其他情况。身份验证应该是根据官方或其他类似权威机构发放的文件，比如护照，身份证或其他不同的辖区要求的和引发的身份证明文件。您提供的地址将使用适当的方法进行验证，比如检查乘用交通工具的票据或利率票据或检查选民登记册等。
<br/>有效的照片：在您注册之前，您须提供您将您的身份证件放在胸前的照片；
<br/>联系方式：电话/手机号码和/或有效的电子邮件地址。
<br/>3.1.2 如果您是一个公司或其他合法实体，我们将收集以下信息以确定您或信托帐户的最终受益人。
<br/>公司注册、登记证；公司的章程与备忘录副本；公司的股权机构和所有权说明的详细证明材料，证明决定本网站账户的开立以及执行的授权委托人的董事会决议；按照要求需要提供的公司董事、大股东及本网站账户有权签字人的身份证明文件；该公司的主要营业地址，如果与公司的邮寄地址不同，提供邮寄地址。如果公司在本地的地址与它的主要营业地址不一致的，则被视为风险较高的客户，需要提交额外附加文件。
<br/>根据不同的司法管辖区的不同规定及不同的实体类型，我们要求的其他认证和权威部门发布的文件以及我们认为必要的文件。
<br/>3.1.3 我们只接受英语版本或汉语版本的身份信息，如不是，请您将您的身份信息翻译成英文的版本并加以公证。
<br/>3.2确认核实
<br/>3.2.1我们要求您提供身份证明文件的全部页面内容。
<br/>3.2.2 我们要求您提供您将您的身份证明文件放在您胸前的照片。
<br/>3.2.3证明文件的副本一般应核和原始凭证进行核对。然而，如果某个可信赖的合适的认证人可证明该副本文件是原始文件准确而全面的复制的，该副本可接受。这样的认证人包括大使、司法委员、地方治安官等。
<br/>3.2.4 对识别最终受益人和账户控制权的要求是确定哪些个人最终所有或控制直接客户，和/或确定正在进行的交易是由他人代为执行。如果是企业，则大股东的身份（例如那些持有10％或以上的投票权益）应被验证。一般，持股25 ％会被认定为正常风险内，其股东身份须验证；持股10%或拥有更多的投票权或股票时被认定为高风险的情况，股东身份须加以验证。
<br/>
<br/>四、监控交易
<br/>4.1 我们根据安全性和实际交易情况时时设置和调整日常交易和提币最高限额;
<br/>4.2如果交易频繁集中发生在某个注册用户或存在超乎合理的情况，我们的专业团队将评估并决定他们是否可疑;
<br/>4.3我们凭借自身的判断认定为可疑交易的情况，我们可能会采取暂停该交易、拒绝该交易等限制性措施，甚至如果可能将尽快逆转该交易，同时向主管部门报告，但不会通知您;
<br/>4.4我们保留拒绝来自于不符合国际反洗钱标准辖区的人或可被视为政治公众人物的人的注册申请，我们保留随时暂停或终止根据我们自身判断为可疑交易的交易，但我们这样做并不违反对您的任何义务和责任。





        `,
        "en-us": `
<br/>BHPC. (hereinafter referred to as "the company") is a company incorporated in the Republic of Malta under the laws of the Republic of Malta, and operates the website https://www.nucleex.com (hereinafter referred to as "this Website" or "the Website"), which is a platform dedicated to the transaction of digital assets and the provision of related services (hereinafter referred to as "the Service"). For the convenience of wording in this Agreement, the Company and the Website are referred to as "we" or other applicable forms of first person pronouns in this Agreement. All natural persons or other subjects who log onto this Website shall be users of this Website. For the convenience of wording in this Agreement, the users are referred to as "you" or any other applicable forms of the second-person pronouns. For the convenience of wording in this Agreement, you and us are collectively referred to as "both parties", and individually as "one party". For the convenience of the Users, all content on this Website may be available in multiple languages. In case of any conflict between different language versions of such content or any omission in any language version, the Chinese version of such content shall prevail.
<br/>
<br/>Important reminder: We hereby remind you that:
<br/>
<br/>The digital assets themselves are not offered by any financial institution, corporation or this Website;
<br/>The digital asset market is new and unconfirmed, and will not necessarily expand;
<br/>Digital assets are primarily used by speculators, and are used relatively less on retail and commercial markets; digital asset transactions are highly risky, due to the fact that they are traded throughout the day without limits on the rise or fall in price, and market makers and global government policies may cause major fluctuations in their prices;
<br/>The Company may suspend or terminate your account or use of the Service, or the processing of any digital asset transaction, at any time if it determines in its sole discretion that you have violated this Agreement or that its provision or your use of the Service in your jurisdiction is unlawful. USE OF THE SERVICE BY PERSONS LOCATED IN THE UNITED STATES OF AMERICA IS PROHIBITED.
<br/>
<br/>Digital assets trading is highly risky and therefore not suitable for the vast majority of people. You acknowledge and understand that investment in digital assets may result in partial or total loss of your investment and therefore you are advised to decide the amount of your investment on the basis of your loss-bearing capacity. You acknowledge and understand that digital assets may generate derivative risks. Therefore, if you have any doubt, you are advised to seek assistance from a financial adviser first. Furthermore, aside from the above-mentioned risks, there may also be unpredictable risks. Therefore, you are advised to carefully consider and use clear judgment to assess your financial position and the abovementioned risks before making any decisions on buying and selling digital assets; any and all losses arising therefrom will be borne by you and we shall not be held liable in any manner whatsoever.
<br/>
<br/>You are hereby informed that:
<br/>You understand that this Website is only intended to serve as a venue for you to obtain digital asset information, find trading counterparties, hold negotiations on and effect transactions of digital assets. This Website does not participate in any of your transactions, and therefore you shall, at your sole discretion, carefully assess the authenticity, legality and validity of relevant digital assets and/or information, and solely bear the responsibilities and losses that may arise therefrom.
<br/>All opinions, information, discussions, analyses, prices, advice and other information on this Website are general market reviews and do not constitute any investment advice. We do not bear any loss arising directly or indirectly from reliance on the abovementioned information, including but not limited to, any loss of profits.
<br/>The content of this Website may be changed from time to time and at any time without notice, and we have taken reasonable measures to ensure the accuracy of the information on the Website; however, we do not guarantee the degree of such accuracy, or bear any loss arising directly or indirectly from the information on this Website or from any delay or failure caused by failure to link up with the internet, transmit or receive any notice and information
<br/>Using internet-based trading systems also involves risks, including but not limited to failures in software, hardware or Internet links, etc. In view of the fact that we cannot control the reliability and availability of the Internet, we will not be responsible for any distortion, delay and link failure.
https://www.nucleex.com is the sole official external information release platform for this Website;
<br/>No service on this Website may be paid for by credit card;
<br/>It is prohibited to use this Website to engage in any illegal transaction activities or illegitimate activities, such as money laundering, smuggling and commercial bribery. In the event that any suspected illegal transaction activities or illegitimate activities is uncovered, this Website will adopt all available measures, including but not limited to freezing the offender’s account, notifying relevant authorities, etc., and we will not assume any of the responsibilities arising therefrom and reserve the right to hold relevant persons accountable;
<br/>It is prohibited to use this Website for the purpose of malicious manipulation of the market, improper transactions or any other illicit trading activities. Where any of such illicit trading activities is uncovered, this Website will adopt such preventive and protective measures as warning, restricting trading and closing accounts against any and all such malicious manipulation of prices, maliciously influencing the trading system and any other illicit behaviors; we do not assume any of the responsibilities arising therefrom and reserve the right to hold relevant persons accountable.
<br/><br/>General Provisions
 <br/>
 <br/>1.1 The User Agreement (hereinafter referred to as "this Agreement" or "these terms and conditions") consists of the main body, Terms of Privacy, Understanding Your client and Anti-money-laundering Policy, as well as any rules, statements, instructions, etc. that this Website has published or may publish in the future.
 <br/>1.2 Before using the services offered by this Website, you shall read this Agreement carefully, and consult a professional lawyer if you have any doubt or as may be otherwise necessary. If you do not agree to the terms and conditions of this Agreement and/or any change made thereto from time to time and at any time, please immediately stop using the service provided by this Website or stop logging onto this Website. Upon your logging into this Website or using any service offered by this Website or engaging in any other similar activity, it shall be deemed as having understood and fully agreeing to all terms and conditions of this Agreement, including any and all changes, modifications or alterations that this Website may make to this Agreement from time to time and at any time.
 <br/>1.3 After filling in the relevant information in accordance with the requirements of this Website, and going through other relevant procedures, you will successfully register yourself as a member of this Website (hereinafter referred to as "Member"); in the process of registration, if you click on the "I Agree", it shall be deemed that you have reached an agreement with the Company by way of electronic signature; or when you use this Website, you click on the "I Agree" button or a similar button, or if you use the services offered by this Website in any of the ways allowed by this Website, it shall be deemed that you fully understand, agree to and accept all the terms and conditions under this Agreement, and in this case, the absence of your handwritten signature will not affect the legal binding force that this Agreement may have on you.
 <br/>1.4 After you become a member of this Website, you will receive a member account and corresponding password, which shall be properly kept by you as a member of this Website; Members shall be liable for all activities and events carried out through their accounts.
 <br/>1.5 You cannot engage in trading on the digital asset trading platform provided by this Website and gain access to the services that are exclusively available to members in accordance with the rules and regulations of this Website, unless and until you become a member of this Website; if you are not a member of this Website, you can only log in to and browse the Website and have access to other services as are permitted by the rules and regulations of this Website.
 <br/>1.6 Upon registering yourself as a member of this Website and using any of the services and functions offered by this Website, it shall be deemed that you have read, understood this Agreement, and:
 <br/>1.6.1 accepted to be bound by all terms and conditions of this Agreement;	               1.6.2 You confirm that you have attained the age of 16, or another statutory age for entering into contracts as is required by a different applicable law, and your registration with this Website, purchase or sale via this Website, release information on this Website and other behaviors indicating your acceptance of the Services offered by this Website shall comply with the relevant laws and regulations of the sovereign state or region that has jurisdiction over you, and you confirm that you have sufficient capacity to accept these terms and conditions, enter into transactions and to use this Website for digital asset transactions.	       1.6.3 You undertake that all your digital assets involved in transactions hereunder are legally acquired and owned by you.
 <br/>1.6.4 You agree to undertake any and all liabilities for your own transaction and non-transaction activities as well as any and all profits and losses therefrom.
 <br/>1.6.5 You confirm that the information provided at the time of registration is true and accurate.
 <br/>1.6.6 You agree to comply with any and all relevant laws, including the reporting of any transaction profits for tax purposes.
 <br/>1.6.7 You agree to always refrain from engaging in or participating in any act or activity that damages the interests of this Website or the Company, whether or not in connection with the Services provided by this Website.
 <br/>1.6.8 This Agreement is only binding on the rights and obligations between you and us, and does not involve legal relations and legal disputes arising from and relating to the transaction of digital assets between the users of this Website, and between other websites and you.
 <br/>
 <br/>2. Amendment of this Agreement We reserve the right to amend this Agreement from time to time, and disclose such amendment by way of announcement on the Website without sending a separate notice to you on your rights. The date when the amendment is made will be indicated on the first page of the amended agreement. The amended agreement will take effect immediately upon announcement on the Website. You shall browse this Website from time to time and follow information on the time and content of amendments, if any, made to this Agreement. If you do not agree with the amendments, you shall stop using the services offered by this Website immediately; if you continue to use the services offered by this Website, it shall be deemed that you accept and agree to be bound by the amended agreement.
 <br/>
 <br/>Registration
 <br/>3.1 Eligibility for Registration You confirm and promise that: you shall be a natural person, legal person or other organization with the ability to sign this Agreement and the ability to use the services of this Website, as is provided by applicable laws, when you complete the registration process or when you use the services offered by this Website in any other manner as is otherwise permitted by this Website. Upon clicking on the button indicating that you agree to register, it shall be deemed that you yourself or your authorized agent agrees to the content of this Agreement and your authorized agent will register with this Website and use the services offered by this Website on your behalf. If you are not a natural person, legal person or organization with the abovementioned ability, you and your authorized agent shall bear all the consequences of that, and the company reserves the right to cancel or permanently freeze your account and to hold you and your authorized agent accountable.
 <br/>3.2 Purpose of Registration You confirm and promise that you do not register with this Website for the purpose of violating any of the applicable laws or regulations or undermining the order of digital asset transactions on this Website.
 <br/>3.3 Registration Process
 <br/>3.3.1 You agree to provide a valid email address, a mobile phone number and other information in accordance with the requirements on the user registration page of this Website. You can use the email address, mobile phone number or any other manner permitted by this Website to log in to this Website. Where it is necessary and in accordance with the requirements of applicable laws and regulations of relevant jurisdictions, you shall provide your real name, identity card and other information required by applicable laws, regulations, the Terms of Privacy, and anti-money-laundering terms, and constantly update your registration data so that they will be timely, detailed and accurate as is required. All of the original typed data will be referenced as registration information. You shall be responsible for the authenticity, integrity and accuracy of such information and bear any direct or indirect loss and adverse consequences arising out of it.
 <br/>3.3.2 If any of the applicable laws, regulations, rules, orders and other regulatory documents of the sovereign country or region in which you are based requires that mobile phone accounts must be based on real names, you hereby confirm that the mobile phone number you provide for registration purposes has gone through the real-name registration procedure. If you cannot provide such a mobile phone number as is required, any direct or indirect losses and adverse consequences arising therefrom and affecting you shall be borne by you.
 <br/>3.3.3 After you provide the required registration information in a legal, complete and valid manner and such information passes relevant verification, you shall have the right to obtain an account and a password of this Website. Upon obtaining such account and password, your registration shall be deemed as successful and you can log into this Website as a member thereof.
 <br/>3.3.4 You agree to receive emails and/or short messages sent by this Website related to the management and operation thereof.
 <br/>
 <br/>Services This Website only provides online transaction platform services for you to engage in digital asset trading activities through this Website (including but not limited to the digital asset transactions etc.). This Website does not participate in the transaction of digital assets as a buyer or seller; This Website does not provide any services relating to the replenishment and withdrawal of the legal currency of any country.
 <br/>
 <br/>4.1 Content of Services
 <br/>4.1.1 You have the right to browse the real-time quotes and transaction information of digital asset products on this Website, to submit digital asset transaction instructions and to complete the digital asset transaction through this Website.
 <br/>4.1.2 You have the right to view information under the member accounts on this Website and to apply the functions provided by this Website.
 <br/>4.1.3 You have the right to participate in the website activities organized by this Website in accordance with the rules of activities posted on this Website.
 <br/>4.1.4 Other services that this Website promises to offer to you.
 <br/>4.2 Service Rules You undertake to comply with the following service rules of this Website:
 <br/>4.2.1 You shall comply with the provisions of applicable laws, regulations, rules, and policy requirements, and ensure the legality of the source of all digital assets in your account, and shall refrain from engaging in any illegal activities or other activities that damages the rights and interests of this Website or any third party, such as sending or receiving information that is illegal, illicit or infringes on the rights and interests of any other person, sending or receiving pyramid scheme information or information or remarks causing other harms, unauthorized use or falsification of the email header information of this Website, inter alia.	4.2.2 You shall comply with applicable laws and regulations and properly use and keep your account in this Website and login password, password of your financial transactions, and the mobile phone number bound with your account that you provide upon registration of your account, as well as the security of the verification codes received via your mobile phone. You shall be solely responsible for any and all your operations carried out using your account with this Website and login password, financial transaction password, verification codes sent to your mobile phone, as well as all consequences of such operations. When you find that your account with this Website, your login password, financial transaction password, or mobile phone verification codes is used by any unauthorized third party, uncover any other problem relating to the security of your account, you shall inform this Website in a prompt and effective manner, and request this Website to temporarily suspend the services to your account with this Website. This Website shall have the right to take action on your request within a reasonable time; nonetheless, this Website does not bear any liability for the consequences that have arisen before such action is taken, including but not limited to any loss that you may sustain. You may not assign your account with this Website to any other person by way of donation, lending, leasing, transfer or otherwise without the consent of this Website.
 <br/>4.2.3 You agree to take responsibility for all activities (including but not limited to information disclosure, information release, online click-approving or submission of various agreements on rules, online renewal of agreements or purchase service) using your account and password with this Website.
 <br/>4.2.4 In your digital asset transactions on this Website, you may not maliciously interfere with the normal proceeding of the digital asset transaction or disrupt the transaction order; you may not use any technical means or other means to interfere with the normal operation of this Website or interfere with the other users' use of the services; you may not maliciously defame the business goodwill of this Website on the ground of falsified fact.
 <br/>4.2.5 If any dispute arises between you and any other user in connection with online transaction, you may not resort to any means other than judicial or governmental means to request this Website to provide relevant information.
 <br/>4.2.6 All taxes payable as well as all fees relating to hardware, software and services that are incurred by you in the course of using the services provided by this Website shall be solely borne by you.
 <br/>4.2.7 You shall abide by this Agreement and other terms of service and operating rules that this Website may release from time to time, and you have the right to terminate your use of the services provided by this Website at any time.
 <br/>4.3 Product Rules
 <br/>4.3.1 Rules for trading products You undertake that in the process in which you log into this Website and engage in transactions with other users through this Website, you will properly comply with the following transaction rules.
 <br/>4.3.1.1 Browsing transaction information When you browse the transaction information on this Website, you should carefully read all the content in the transaction information, including but not limited to the price, consignment, handling fee, buying or selling direction, and you shall accept all the contents contained in the transaction information before you may click on the button to proceed with the transaction.	4.3.1.2 Submission of Commission After browsing and verifying the transaction information, you may submit your transaction commissions. After you submit the transaction commission, it shall be deemed that you authorize this Website to broker you for the corresponding transactions, and this Website will automatically complete the matchmaking operation when there is a transaction proposal that meets your price quotation, without prior notice to you.
 <br/>4.3.1.3 Accessing transaction details You can check the corresponding transaction records in the transaction statements by the Management Center, and confirm your own detailed transaction records.
 <br/>4.3.1.4 Revoking/modifying transaction commission. You have the right to revoke or modify your transaction commission at any time before the transaction is concluded.
 <br/>
 <br/>Rights and Obligations of this Website
 <br/>5.1 If you do not have the registration qualifications agreed on in this Agreement, this Website shall have the right to refuse to allow you to register; if you have already registered, this Website shall have the right to revoke your member account, and this Website reserves the right to hold you or your authorized agent accountable. Furthermore, this Website reserves the right to decide whether to accept your application for registration under any other circumstances.
 <br/>5.2 When this Website finds at its sole discretion that you or your associated account user is not suitable for high-risk investment, this Website shall have the right to suspend or terminate the use of your account and all associated accounts thereof.
 <br/>5.3 When this Website finds out that the user of an Account is not the initial registrant of that Account, it shall have the right to suspend or terminate the user's access to that Account.
 <br/>5.4 Where by means of technical testing or manual sampling, among others, this Website reasonably suspects that the information you provide is wrong, untrue, invalid or incomplete, this Website shall have the right to notify you to correct or update the information, or suspend or terminate its supply of the services to you.
 <br/>5.5 This Website shall have the right to correct any information displayed on this Website when it uncovers any obvious error in such information.5.6 This Website reserves the right to modify, suspend or terminate the Services offered by this Website, at any time, and the right to modify or suspend the Service without prior notice to you; if this Website terminates one or more of the Services offered by this Website, such termination by this Website will take effect on the date of announcement of such termination on the Website.
 <br/>5.7 This Website shall take necessary technical means and management measures to ensure the normal operation of this Website, and shall provide a necessary and reliable trading environment and transaction services, and shall maintain the order of digital assets trading.
 <br/>5.8 If you fail to log into this Website using your member account number and password for an uninterrupted period of one year, this Website shall have the right to revoke your account. After your account is revoked, this Website shall have the right to offer the member name represented by such account to other applicants for membership.
 <br/>5.9 This Website shall ensure the security of your digital assets by strengthening technical input and enhancing security precautions, and is under the obligation to notify you in advance of the foreseeable security risks in your account.
 <br/>5.10 This Website shall have the right to delete all kinds of content and information which does not conform to laws and regulations or the rules of this Website at any time, and exercise of this right by this Website is not subject to a prior notice to you.
 <br/>5.11 This Website shall have the right to, in accordance with the applicable laws, administrative regulations, rules, orders and other regulatory documents of the sovereign country or region where you are based, request to you for more information or data, and to take reasonable measures to meet the requirements of the local standards, and you have the obligation to provide proper assistance to such measures; this Website shall have the right to suspend or permanently terminate your access to this Website as well as part or all of the services offered by this Website.
 <br/>
 <br/>Indemnity
 <br/>6.1 Under any circumstance, our liability for your direct damage will not exceed the total cost incurred by your three (3) months' use of services offered by this Website.
 <br/>6.2 Shall you breach this Agreement or any applicable law or administrative regulation, you shall pay to us at least US$ Two million in compensation and bear all the expenses in connection with such breach (including attorney's fees, among others). If such compensation cannot cover the actual loss, you shall make up for the difference.
 <br/>
 <br/>7. The Right to Injunctive Relief Both you and we acknowledge that common law remedies for breach of agreement or possible breach of contract may be insufficient to cover all the losses that we sustain; therefore, in the event of a breach of contract or a possible breach of contract, the non-breaching party shall have the right to seek injunctive relief as well as all other remedies that are permitted under common law or equity.
 <br/>
 <br/>Limitation and Exemption of Liability
 <br/>8.1 You understand and agree that under no circumstance will we be held liable for any of the following events:
 <br/>8.1.1 loss of income;
 <br/>8.1.2 loss of transaction profits or contractual losses;
 <br/>8.1.3 disruption of the business
 <br/>8.1.4 loss of expected currency losses
 <br/>8.1.5 loss of information
 <br/>8.1.6 loss of opportunity, damage to goodwill or reputation
 <br/>8.1.7 damage or loss of data;
 <br/>8.1.8 cost of purchasing alternative products or services;
 <br/>8.1.9 any indirect, special or incidental loss or damage arising from any infringement (including negligence), breach of contract or any other cause, regardless of whether or not such loss or damage may reasonably be foreseen by us, and regardless of whether or not we are notified in advance of the possibility of such loss or damage.
 <br/>8.1.10 Items 8.1.1 to 8.1.9 are independent of each other.
 <br/>8.2 You understand and agree that we shall not be held liable for any damages caused by any of the following events:
 <br/>8.2.1 Where we are properly justified in believing that your specific transactions may involve any serious violation or breach of law or agreement;
 <br/>8.2.2 Where we are reasonably justified in believing that your conduct on this Website is suspected of being illegal or immoral;
 <br/>8.2.3 The expenses and losses arising from the purchase or acquisition of any data, information or transaction, etc. through the services offered by this Website;
 <br/>8.2.4 Your misunderstanding of the Services offered by this Website;	8.2.5 Any other losses related to the services provided by this Website, which cannot be attributed to us.
 <br/>8.3 Where we fail to provide the Services or delay in providing such Services due to information network equipment maintenance, information network connectivity failures, errors in computer, communications or other systems, power failures, weather conditions, unexpected accidents, industrial actions, labor disputes, revolts, uprisings, riots, lack of productivity or production materials, fires, floods, storms, explosions, wars, failure on the part of banks or other partners, collapse of the digital asset market, actions by government, judicial or administrative authorities, other acts that are not within our control or beyond our inability to control, or due to causes on the part of third parties, we shall not assume any responsibility for such failure to provide service or delay in providing services, or for the resultant loss you may sustain as a result of such failure or delay.
 <br/>8.4 We cannot guarantee that all the information, programs, texts, etc. contained in this Website are completely safe, free from the interference and destruction by any malicious programs such as viruses, trojans, etc., therefore, your log-into this Website or use of any services offered by this Website, download of any program, information and data from this Website and your use thereof are your personal decisions and therefore you shall bear the any and all risks and losses that may possibly arise.
 <br/>8.5 We do not make any warranties and commitments in connection with any of the information, products and business of any third party websites linked to this Website, as well as any other forms of content that do not belong to us; your use any of the services, information, and products provided by a third party website is your personal decision and therefore you shall assume any and all the responsibilities arising therefrom.	8.6 We do not make any explicit or implicit warranties regarding your use of the Services offered by this Website, including but not limited to the applicability, freedom from error or omission, consistency, accuracy, reliability, and applicability to a specific purpose, of the services provided by this Website. Furthermore, we do not make any commitment or guarantee in connection with the validity, accuracy, correctness, reliability, quality, stability, integrity and timeliness of the technology and information covered by the services offered by this Website. Whether to log in this Website or use the services provided by this Website is your personal decision and therefore you shall bear all the risks and possible losses arising from such decision. We do not make any explicit or implicit warranties in connection with the market, value and price of digital assets; you understand and acknowledge that the digital asset market is unstable, that the price and value of assets may fluctuate or collapse at any time, and that the transaction of digital assets is based on your personal free will and decision and therefore you shall assume any and all risks and losses that may possible arise therefrom.
 <br/>8.7 The guarantees and undertakings specified in this Agreement shall be the only guarantee and statements that we make in connection with the Services provided by us under this Agreement and through this Website, and shall supersede any and all the warranties and commitments arising in any other way and manner, whether in writing or in words, express or implied. All these guarantees and statements represent only our own commitments and undertakings and do not guarantee any third party's compliance with the guarantees and commitments contained in this Agreement.
 <br/>8.8 We do not waive any of the rights not mentioned in this Agreement and to the maximum extent permitted by the applicable law, to limit, exempt or offset our liability for damages.
 <br/>8.9 Upon your registration of your account with this Website, it shall be deemed that you approve any and all operations performed by us in accordance with the rules set forth in this Agreement, and any and all risks arising from such operations shall be assumed by you.
 <br/>
 <br/>Termination of Agreement
 <br/>9.1 This Website shall have the right to cancel your account with this Website in accordance with this Agreement, and this Agreement shall be terminated on the date of the cancellation of your account.
 <br/>9.2 This Website shall have the right to terminate all Service offered by this Website to you in accordance with this Agreement, and this Agreement shall terminate on the date of termination of all services offered by this Website to you.
 <br/>9.3 After the termination of this Agreement, you do not have the right to require this Website to continue to provide you with any service or perform any other obligation, including, but not limited to, requesting this Website to keep or disclose to you any information in your former original account, or to forward to you or any third party any information therein that is not read or sent.
 <br/>9.4 The termination of this Agreement shall not prevent the observant party from demanding the breaching party to assume other liabilities.
 <br/>
<br/> <br/>Intellectual Property
<br/>10.1 All intellectual achievements included in this Website, including, but not limited to, website logos, databases, website design, text and graphics, software, photos, videos, music, sounds and any combinations of the aforementioned files, and the intellectual property rights of software compilation, associated source code and software (including small applications and scripts) shall be owned by this Website. You may not copy, modify, copy, transmit or use any of the foregoing materials or content for commercial purposes.
<br/>10.2 All rights contained in the name of this Website (including but not limited to business goodwill and trademarks, logos) shall be owned by the Company.
<br/>10.3 Upon accepting this Agreement, it shall be deemed that you, on the basis of your own free will, have transferred and assigned exclusively and free of charge to this Website all copyright of any form of information that you publish on this Website, including, but not limited to copyrights, distribution rights, lease rights, exhibition rights, performance rights, projection rights, broadcasting rights, information network dissemination rights, shooting rights, adaptation rights, translation rights, compilation rights and other transferable rights that copyright owners are entitled to, and this Website shall have the right to sue for any infringement on such copyright and obtain full compensation for such infringement. This Agreement shall apply to any content that is published by you on this Website and is protected by copyright law, regardless of whether the content is generated before or after the signing of this Agreement.
<br/>10.4 You shall not illegally use or dispose of the intellectual property rights of this Website or any other person during your use of the services offered by this Website. For any information that you publish on this Website, you may not publish or authorize other websites (or media) to use such information in any manner wuatsoever.
<br/>10.5 Your log into this Website or use of any of the services offered by this Website shall not be deemed as our transfer of any intellectual property to you.
<br/>
<br/>Information protection
<br/>11.1. Scope of Application
<br/>11.1.1 When you register your account with this Website or use your account with this Website, you shall provide personal registration information in accordance with the requirements of this Website, including but not limited to your telephone number, email address, and identity card information.
<br/>11.1.2 When you use the services offered by this Website, or visit this Website, this Website will automatically receive and record the server information of your web browser, including but not limited to the IP address and records on the web pages that you request to access.	11.1.3 The relevant data collected by this Website in connection with your transactions on this Website, including but not limited to transaction records.
<br/>11.1.4 Other personal information of yours legally obtained by this Website.
<br/>11.2 Use of Information
<br/>11.2.1 Upon your successful registration with this Website and without extra consent from you, it shall be deemed that you agree to permit this Website to collect and use all the information you publish on this Website; as is specified under 11.1 hereof, you acknowledge and agree that this Website can use your information collected by this Website for certain purposes, including but not limited to the following:
<br/>11.2.1.1 providing you with the services offered by this Website;
<br/>11.2.1.2 Reporting to relevant regulatory departments based on the requirements of the competent authorities in relevant sovereign states or regions;
<br/>11.2.1.3 When you use Services offered by this Website, this Website will use your information for such legal purposes as identity authentication, customer service, security, fraud monitoring, marketing & promotion, archiving, and backup, or joint promotion of this Website with a third party, so as to ensure the security of the products and services that this Website offers to you;
<br/>11.2.1.4 Information collection and processing for the purpose of helping this Website design new products and services and improving the existing services offered by this Website;
<br/>11.2.1.5 In order to enable you to understand the specifics of the Services offered by this Website, you agree to permit this Website to send to you marketing event information, commercial electronic information, and advertising that is related to you in replacement of general-purpose ubiquitous advertising;
<br/>11.2.1.6 This Website may transfer or disclose your information to any third party that is not a related party of this Website, for the purpose of completing merger, division, acquisition or transfer of assets;
<br/>11.2.1.7 Software certification or management software upgrade;
<br/>11.2.1.8 Inviting you to participate in surveys in connection with the services offered by this Website;
<br/>11.2.1.9 Data analysis relating to cooperation with government agencies, public affairs agencies, associations, etc;
<br/>11.2.1.10 For all other legal purposes as well as other purposes authorized by you.
<br/>11.2.2 This Website will not sell or lend your personal information to any other person unless your permission is obtained in advance. This Website also does not allow any third party to collect, edit, sell or gratuitously spread your personal information in any manner whatsoever.
<br/>11.3 This Website shall keep confidential the customer identity information and transaction information that it obtains, and shall not provide any entity or individual with customer identification information or transaction information, except where any of the applicable laws, regulations, decrees, orders, etc., of relevant sovereign states or regions requires this Website to provide such information.
<br/>
<br/>Calculation All the transaction calculations are verified by us, and all the calculation methods have been posted on the Website, but we can not ensure that your use of this Website will not be disturbed or free from errors.
<br/>
<br/>Export Control You understand and acknowledge that in accordance with relevant laws of the Republic of Malta, you shall not export, re-export, import or transfer any material (including software) on this Website; therefore, you hereby undertake that you will not voluntarily commit or assist or participate in any of the above export or related transfer or other violations of applicable laws and regulations; if you uncover any of the aforementioned events, you will report to us and assist us in handling them.
<br/>
<br/>Transfer The rights and obligations agreed in this Agreement shall be equally binding on the assignees, the heirs, executors and administrators of the parties hereto who benefit from the rights and obligations. Without our consent, you may not transfer to any third party any of your rights or obligations hereunder, provided, however, we may, at any time, assign our rights and obligations under this Agreement to any third party with thirty (30) days' notice to you.
<br/>
<br/>Severability If any provision of this Agreement is found unenforceable, invalid or illegal by any court of competent jurisdiction, validity of the remaining provisions of this Agreement shall not be affected.
<br/>
<br/>No Agency Nothing in this Agreement shall be deemed to have created, implied or otherwise treated us as your agent, trustee or other representative, unless it is provided otherwise in this Agreement.
<br/>
<br/>Waiver Our or your waiver of the right to hold the other party liable for breaches of agreement or any other liability as is agreed upon in this Agreement shall not be construed or deemed as a waiver of the right to hold the other party for other breaches of contract; a failure to exercise any right or remedy shall not be construed in any way as a waiver of such right or remedy.
<br/>
<br/>Headings All headings herein are exclusively for the convenience of wording and are not intended to to expand or limit the content or scope of the terms and conditions of this Agreement.
<br/>
<br/>Applicable Law This Agreement in its entirety is a contract concluded under the laws of the Republic of Malta, and relevant laws of the Republic of Malta shall apply to its establishment, interpretation, content and enforcement; Any claims or actions arising out of or relating to the Services agreed in this Agreement shall be governed and interpreted and enforced in accordance with the laws of the Republic of Malta. For the avoidance of doubt, this Clause shall be expressly applicable to any tort claim against us. The competent court or forum for any claim or action against us or in relation to us shall be in the Republic of Malta. You have unconditional access to exclusive jurisdiction in court proceedings and appeals in the courts of the Republic of Malta. You also unconditionally agree that the venue or competent court for any dispute or problem relating to this Agreement or any claim and proceeding arising from this Agreement shall be exclusively in the Republic of Malta. If any other business of this Website is subject to any special agreement on jurisdiction, such agreement shall prevail. The Doctrine of Forum Non Conveniens does not apply to the court of choice under these Terms of Service.
<br/>
<br/>Entry into Force and Interpretation of the Agreement 20.1 This Agreement shall enter into force when you click through the registration page of this Website, complete the registration procedures, obtain your account number and password of this Website, and shall be binding on you and this Website. 20.2 The ultimate power of interpretation of this Agreement shall be vested in this Website. Know-your-customers and Anti-Money Laundering Policies
<br/>
<br/>Preamble
<br/>1.1 We ensure that we comply with know-your-customer and anti-money-laundering laws and regulations, and will not knowingly violate know-your-customers and anti-money-laundering policies. To the extent of our reasonable control, we will adopt necessary measures and technology to provide you with Services that are safe and secure, so as to protect you against the loss caused by money laundering to the greatest extent possible.
<br/>1.2 Our know-your-customer and anti-money-laundering policies are a comprehensive system of international policies, including the know-your-customer and anti-money-laundering policies of the jurisdictions to which you are subject to. Our robust compliance framework ensures that we meet regulatory requirements and regulatory standards on both the local and global levels, and ensure the operational sustainability of our website.
<br/>
<br/>Content of Our Know-Your-Customer and Anti-Money-Laundering Policies
<br/>2.1 We promulgate and update know-your-customers and anti-money-laundering policies to meet the standards set by relevant laws and regulations;
<br/>2.2 We promulgate and update some of the guidelines and rules in connection with the operation of this Website, and our staff will provide you whole-process service in accordance with the guidelines and rules;	2.3 We design and complete the procedures for internal monitoring and transaction control, such as rigorous identity authentication procedures, and form a professional team responsible for anti-money laundering;	2.4 We adopt risk-prevention-based approach to carry out due diligence and continuous supervision in connection with customers;
<br/>2.5 Review and regularly inspect existing transactions;
<br/>2.6 To report suspicious transactions to the competent authorities;	2.7 Proof documents of identity documents, address certificates and transaction records will be maintained for at least six(6) years; if they are submitted to the regulatory authorities, let it be understood that a separate notice will not be provided to you;
<br/>2.8 Credit cards are prohibited throughout the course of the transaction;
<br/>
<br/>Identity Information and the Verification and Confirmation Thereof
<br/>3.1 Identity Information
<br/>3.1.1 In accordance with the laws and regulations of relevant jurisdictions and in light of the nature of entities concerned, the content of your information as is collected by us may vary, and in principle, we will collect the following information of yours if you register as an individual: Basic personal information: your name, address (and permanent address, if the two are different), date of birth and nationality, and other information available. Identity authentication shall be based on documents issued by the official or other similar authorities, such as passports, identity cards or other identity documents as are required and issued by relevant jurisdictions. The address you provide will be validated in an appropriate manner, such as checking the fare ticket of means of transportation you use, your interest rate bills, or voter register. Valid photo: before you register, you must provide a photograph showing you holding your identity document in front of your chest; Contact information: telephone/mobile phone number and valid email address.3.1.2 If you are a company or any other type of legal entity, we will collect the following information of yours to determine the final beneficiary of your account or your trust account. Your corporation enrollment and registration certificates of the company; a copy of the articles of association and memorandum of the company; the detailed certification materials of the ownership structure and ownership description of the company, and the decision of the board of directors on designating the authorized agent of the company responsible for the opening and execution of the account of the company with the website; the identity documents of the directors, major shareholders of the company as well as the authorized signatory for the company's account with the website, as are required to be provided in accordance with relevant rules; the company's main business address, and the company's mailing address if it is different from the main business address of the company. If the local address of the company is different from its main business address, the company shall be deemed to be a high-risk customer, and consequently the company will be required to provide additional documentation. Other certification documents, documents issued by competent authorities and other documents we may deem necessary in light of the laws and regulations of relevant jurisdictions and in light of the specific nature of your entity.
<br/>3.1.3 We only accept English and Chinese versions of your identity information; if your identity information is not in either of the two languages, you shall have your identity information translated into English and duly notarized.
<br/>3.2 Confirmation and Verification
<br/>3.2.1 You are required to provide both the front and back sides of your identity documents.
<br/>3.2.2 You are required to provide us with a photograph showing you holding your identity documents in front of your chest.
<br/>3.2.3 Copies of certification documents shall be checked against the originals thereof. Nonetheless, if a trusted and suitable certifier person can prove that such copies are accurate and comprehensive duplicates of the originals thereof, such copies shall be deemed as acceptable. Such certifiers include ambassadors, members of the judiciary, magistrates, etc.
<br/>3.2.4 The identification the ultimate beneficiary and controller of the account shall be based on the determination of which individuals ultimately own or control the direct customer and/or to determining that the ongoing transaction is performed by another person. If you are a business enterprise, the identity of major shareholders thereof (for example, those holding 10 % or more of the voting equity in such business enterprise) shall be verified. Generally, a shareholder holding 25 % of the shares of the company will be deemed as involving an average level of risk, and the identity of the shareholder shall be verified; a shareholder holding 10 % or more of the voting rights or shares is deemed to be involving a high level of risk, and the identity of the shareholder shall be verified.
<br/>
<br/>Transaction Supervision
<br/>4.1 We constantly set and adjust daily trading and cash withdrawal limits based on security requirement and actual state of transactions;
<br/>4.2 If the transaction occurs frequently in an account registered by you or is beyond reasonable circumstances, our professional team will assess and determine whether such transaction is suspicious;
<br/>4.3 If we identify a specific transaction as suspicious on the basis of our assessment, we may adopt such restrictive measures as suspending the transaction or denying the transaction, and if it is possible, we may even reverse the transaction as soon as possible, and report to the competent authorities, without, however, notifying you;
<br/>4.4 We reserve the right to reject registration applications by applicants that do not comply with the international standards against money laundering or who may be regarded as political and public figures; we reserve the right to suspend or terminate a transaction identified as suspicious based on our own assessment, which, however, does not breach any of our obligations and duties to you.
        `,
      },
    };
  }
  render() {
    const lang = window.localStorage.lang;
    return (
      <div className={s.doc}>
        <h2 dangerouslySetInnerHTML={{ __html: this.state.title[lang] }} />
        <p dangerouslySetInnerHTML={{ __html: this.state.content[lang] }} />
      </div>
    );
  }
}

export default Agreement;
