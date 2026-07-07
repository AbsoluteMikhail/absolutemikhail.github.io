import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

const menteeReviews = [
  {
    name: "ASKUT",
    paragraphs: [
      "Занимался с Михаилом, когда особо в UE не разбирался - требовалась помощь с pet проектом / мини игрой. Он не только сильно помог, но и дал много полезного материала по поводу Unreal Engine в целом.",
      "Очень понравилось, что все материалы, план занятий, все ссылки и даже записи занятий Михаил оставлял в гугл презентации. Даже после окончания проекта несколько раз туда возвращался за полезной информацией.",
      "По любым вопросам с движком всегда отвечает. Всем советую.",
    ],
  },
  {
    name: "Danone Song",
    paragraphs: [
      "Занималась с Михаилом, остались только положительные впечатления!",
      "Михаил очень хороший специалист и преподаватель: на первом занятии обсудили мой уровень, посмотрели мои проекты и наметили на основе этого план обучения. Очень понравилось, что Михаил кидает много полезных материалов.",
      "Даже если на уроке возник какой-то вопрос не совсем по программе, он все равно на него ответит и после занятия скинет полезную статью по теме.",
      "В процессе обучения мне предложили работу, и Михаил очень помог в подготовке к тех. собесу и решению тестового, благодаря чему я получила оффер в хорошей компании. Ментора рекомендую!",
    ],
  },
  {
    name: "Djambulat Horn",
    paragraphs: [
      "Менторился у Михаила в период, когда не мог определиться с направлением. На первой ознакомительной консультации провел мне техсобес и проверил мои слабые и сильные стороны. Далее составил программу курса и скинул мне на согласование.",
      "Мы начали заниматься, и огромный плюс - это предоставление мини-документации по уроку + запись урока. Д.з после каждого занятия, ведение проекта через git. Мне было максимально комфортно менториться.",
      "Прошло много времени, я устроился на работу разработчиком, но продолжаю иногда в лс мучать вопросами Михаила. И он всегда на связи: ответит, посоветует. Спасибо!",
    ],
  },
];

const MenteeReviewsSection = () => (
  <section className="relative overflow-hidden bg-background pb-24">
    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="mb-12 max-w-3xl"
      >
        <div className="mb-4 inline-block rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-accent">
            Отзывы менти
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          Что говорят после занятий
        </h2>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-3">
        {menteeReviews.map((review, index) => (
          <motion.article
            className="flex h-full flex-col rounded-lg border border-border bg-card/45 p-6 transition-colors hover:border-primary/35 hover:bg-card/65"
            initial={{ opacity: 0, y: 30 }}
            key={review.name}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <MessageSquareQuote className="mb-5 h-7 w-7 text-primary" />
            <div className="mb-6 flex-1 space-y-4 text-sm leading-7 text-foreground/80">
              {review.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraph}>
                  {paragraphIndex === 0 ? `"${paragraph}` : paragraph}
                  {paragraphIndex === review.paragraphs.length - 1 ? `"` : ""}
                </p>
              ))}
            </div>
            <div className="border-t border-border/60 pt-4">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                {review.name}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default MenteeReviewsSection;
