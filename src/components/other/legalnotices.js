import React from "react";
import s from "./style.less";

class Agreement extends React.Component {
  constructor() {
    super();
    this.state = {
      title: {
        "zh-cn": "法律声明",
        "en-us": "Privacy Policy"
      },
      content: {
        "zh-cn": `

<br/>第一条
<br/>本网站的宗旨是在不违反马耳他共和国相关法律法规的前提下，尽可能地为全球广大数字资产爱好者及投资者提供专业的国际化水准的交易平台和金融产品。禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将冻结账户，立即报送有权机关。
<br/>
<br/>第二条
<br/>当有权机关出示相应的调查文件要求本站配合对指定用户进行调查时， 或对用户账户采取查封、冻结或者划转等措施时，本站将按照有权机关的要求协助提供相应的用户数据，或进行相应的操作。 因此而造成的用户隐私泄露、账户不能操作及因此给所造成的损失等，本站不承担任何责任。
<br/>
<br/>第三条
<br/>本网站使用者因为违反本声明的规定而触犯马耳他共和国相关法律的，本站作为服务的提供方，有义务对平台的规则及服务进行完善， 但本站并无触犯马耳他共和国相关法律的动机和事实，对使用者的行为不承担任何连带责任。
<br/>
<br/>第四条
<br/>凡以任何方式登录本网站或直接、间接使用本网站服务者，视为自愿接受本网站声明的约束。
<br/>第五条
<br/>本声明未涉及的问题参见马耳他共和国有关法律法规，当本声明与马耳他共和国相关法律法规冲突时，以马耳他共和国相关法律法规为准。
<br/>
<br/>  `,
        "en-us": `
<br/>Article 1
<br/>This website is intended to provide to its best efforts financial products and trading platform of professional and international standards for the majority of global digital assets enthusiasts and investors, on the precondition that it does not violate any of the relevant laws and regulations of the Republic of Malta. It is prohibited to use this Website for the purpose of engaging in such illegal trading activities as money laundering, smuggling and commercial bribery; where any account is found to involve any of the aforementioned illegal activities, this Website will freeze the account and immediately report such account to the competent authority.
<br/>
<br/>Article 2
<br/>Where a competent authority, on the strength of applicable investigation certificate, requests this Website to cooperate with the investigation relating to any designated user, or if the account of the user is subject to such measures as closure, freezing, or transfer, this Website will, as is required by the competent authority, assist such authority by providing corresponding data relating to the account user, or carrying out the corresponding operation as is required by the competent authority; for any disclosure of the user’s privacy, failure in the operation of the account and any such losses arising therefrom, this Website will not be held liable in any manner whatsoever.
<br/>
<br/>Article 3
<br/>Where a user of this Website violates any provision in this statement and consequently violates any clause of relevant laws of the Republic of Malta, this Website, as a service provider, is obliged to improve the rules and services of this platform. However, this Website does not have either the motivation for violating any law of the Republic of Malta, nor has this Websites commits any actual breach of any of the relevant laws of the laws of the Republic of Malta, and will not assume any joint or several liability for the acts of the user.
<br/>
<br/>Article 4
<br/>Any person that logs into this Website or uses this Website directly or indirectly shall be deemed as having accepted the restriction of this Website voluntarily.
<br/>
<br/>Article 5
<br/>Any matter not covered in this statement shall be handled in accordance with relevant laws and regulations of the Republic of Malta. Where this statement is in conflict with relevant laws and regulations of the Republic of Malta, the latter shall prevail.


        `
      }
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
