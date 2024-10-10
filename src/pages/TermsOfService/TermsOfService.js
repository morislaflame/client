import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="content">
      <h1>Warranty terms and conditions</h1>

      <div className='terms-of-service-content'>
        <div className='terms-of-service-content-eng'>
          <h3>Warranty is valid if within 14 days:</h3>

          <ul>
            <li>model goes missing (through no fault of your own).</li>   
            <li>model is extremely sluggish and takes several days to respond.</li>
            <li>any information we provided to you was inaccurate and is detrimental to cooperation.</li>
            <li>model does not sign a contract (if you need it).</li>
          </ul>

          <p>
            Once payment is received, we will connect you with a model so you can begin work. 
            The money will be on hold for 14 days while you coordinate with the model. 
            If something doesn't work out, we will refund your money. 
          </p>

          <p>
            If either situation arises, we will request a detailed correspondence history with the model and review it carefully. 
            If you had a video interview during the warranty period, it is your responsibility to record the conversation and keep it in case we need it. 
            Failure to record the video call may result in a recourse of 50% of the refund. 
          </p>

          <p>
              If the situation is clearly not the fault of the buyer (poor quality, unprofessional handling, etc.), 
              the warranty will be honored. We will not give a refund if you did not put enough effort into the model or showed unprofessionalism towards the model. 
              If a model quits because she is not making money, this may result in a reduced refund. 
              No guarantee will be given if the model notices that you are a start-up agency and don't know how to scale and customize your work. 
          </p>

          <p>
              We also advise against calling her via video call if you are unrepresentable looking, don't know how to speak confidently, 
              don't know how an interview works, can't make a decent sales pitch, or other similar cases. 
              The guarantee does not cover the cases described above.
          </p>

          <p>
              We will hold the money for 14 days to enforce the warranty and refund the buyer within that time frame.
          </p>

          <span>Payment is made via Crypto.</span>
          </div>
          
          <div>👇🏼🇷🇺Translation</div>

        <div className='terms-of-service-content-rus'>
              <p>По вопросам продаж и покупок обращайтесь к @EMM_assessor</p>

              <h2>Условия гарантии и правила:</h2>

              <h3>Гарантия действует, если в течение 14 дней:</h3>

              <ul>
              <li>модель пропадает (не по вашей вине).</li>
              <li>модель работает крайне вяло и требует нескольких дней для ответа.</li>
              <li>какая-либо информация, которую мы вам предоставили, была недостоверной и вредит сотрудничеству.</li>
              <li>модель не подписывает договор (если вы в этом нуждаетесь).</li>
              </ul>

              <p>
                После получения оплаты мы соединим вас с моделью, чтобы вы могли начать работу. 
                В течение 14 дней деньги будут находиться в режиме ожидания, пока вы будете согласовывать все вопросы с моделью. 
                Если что-то не получится, мы вернем вам деньги. 
              </p>

              <p>
                В случае возникновения любой из ситуаций мы запросим подробную историю переписки с моделью и внимательно ознакомимся с ней. 
                Если в течение гарантийного срока у вас было видеоинтервью, вы обязаны записать разговор и сохранить его на случай, 
                если он нам понадобится. Отсутствие записи видеозвонка может привести к регрессу в размере 50% от суммы возврата. 
              </p>

              <p>Если ситуация возникла явно не по вине покупателя (некачественное, непрофессиональное обращение и т.д.), гарантия будет предоставлена.
                 Мы не будем возвращать деньги, если вы не приложили достаточных усилий для работы с моделью или проявили непрофессионализм по отношению к ней. 
                 Если модель уходит из-за того, что не зарабатывает деньги, это может привести к уменьшению суммы возмещения. 
                 Гарантия не будет предоставлена в случае, если модель заметит, что вы начинающее агентство и не знаете, как масштабировать и настроить работу. 
              </p>

              <p>Также мы не советуем звонить ей по видеосвязи, если вы  непрезентабельно выглядите, не умеете уверенно говорить, не знаете, 
                как проходит собеседование, не можете сделать приличное торговое предложение или в других подобных случаях. 
                Гарантия не распространяется на случаи, описанные выше.
              </p>

              <p>Мы будем удерживать деньги в течение 14 дней, чтобы обеспечить соблюдение гарантийных 
                обязательств и вернуть деньги покупателю в течение этого срока.</p>

              <span>Оплата производится через криптовалюту.</span>
        </div>
</div>
    </div>
  );
};

export default TermsOfService;
