import { L, type Chapter } from "./types.ts";

export const statistics: Chapter[] = [
  {
    slug: "descriptive-statistics",
    volume: "statistics",
    level: "foundational",
    title: "Describing data",
    minutes: 35,
    summary:
      "Basic statistics: what kind of data you have, where its center is, how spread out it is, what shape it takes, and what a single summary number hides.",
    prereqs: ["arithmetic", "algebra"],
    ideas: [
      "Know the kind of data first. Categories, ranks, and measurements need different summaries.",
      "A center without a spread is half a description. Report both.",
      "The mean is pulled by extreme values. The median is not. Skewed data needs the median, or both.",
      "Every summary throws information away. Plot the data before you trust a number about it.",
      "A sample describes a population only as well as the way it was drawn.",
    ],
    body: [
      "Statistics starts with a question about a group, called the population, and data on some of its members, called the sample. Before any arithmetic, decide what kind of variable you have. Categorical data names a group: blood type, country, yes or no. Ordinal data has an order but no fixed spacing: a pain scale from 1 to 10, a satisfaction rating. Numerical data is a measured or counted quantity with meaningful differences: height in centimetres, the number of children in a household. You can count categories and find the most common one, the mode. You can rank ordinal values and find a median. Only numerical data supports a mean, and averaging a satisfaction scale quietly assumes the gap from 1 to 2 equals the gap from 4 to 5.",
      "The center of numerical data has three common measures. The mean is the sum divided by the count: the balance point of the data. The median is the middle value once the data is sorted, or the average of the two middle values when the count is even. The mode is the most frequent value. In symmetric data they agree. In skewed data they separate, and the mean is dragged toward the long tail. A town where most households earn about 40 thousand and one earns 40 million has an enormous mean income and an ordinary median. Neither number is wrong, but they answer different questions: the mean tells you the total divided equally, the median tells you about a typical household.",
      "Spread says how far values sit from the center. The range, maximum minus minimum, depends on only two values and so on the most unusual ones. The interquartile range, Q3 minus Q1, is the width of the middle half and ignores the extremes. The variance is the average squared distance from the mean, and the standard deviation is its square root, back in the original units. For a sample we divide the sum of squared deviations by n − 1, not n. The deviations from the sample mean always sum to zero, so only n − 1 of them are free to vary, and dividing by n would systematically underestimate the population variance. This correction is called Bessel’s correction.",
      "Shape is what the summaries hide. A histogram shows whether data is symmetric, skewed left or right, has one peak or two, or has a few outliers sitting far from the rest. Two data sets can share the same mean, median, and standard deviation and look completely different when plotted. A boxplot draws the five-number summary, minimum, Q1, median, Q3, maximum, and flags points more than 1.5 interquartile ranges beyond the quartiles as possible outliers. An outlier is a prompt to investigate, not an instruction to delete: it may be a typo, or it may be the most important observation you have.",
      "Standardizing puts values from different scales side by side. A z-score says how many standard deviations a value sits above or below the mean, so a z of 2 on one exam and a z of 1 on another compare performance relative to each group. Percentiles do the same job without assuming any shape: the 90th percentile is the value below which 90% of the data falls. For two numerical variables, the Pearson correlation r measures how tightly the points hug a straight line, from −1 to +1. It describes linear association only. A perfect U-shaped relationship can have r = 0, and a strong r says nothing about which variable, if either, causes the other.",
    ],
    formulas: [
      {
        id: "sample-mean",
        name: "Sample mean",
        tex: L`\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i`,
        meaning:
          "Add every observation and divide by how many there are. The balance point of the data, sensitive to extreme values.",
        symbols: [
          { sym: "x̄", means: "The sample mean, read “x bar”" },
          { sym: "n", means: "Number of observations in the sample" },
          { sym: "x_i", means: "The i-th observation" },
          { sym: "Σ", means: "Sum over i from 1 to n" },
        ],
      },
      {
        id: "weighted-mean",
        name: "Weighted mean",
        tex: L`\bar{x}_w=\frac{\sum_{i} w_i x_i}{\sum_{i} w_i}`,
        meaning:
          "A mean where some values count more than others, such as course grades weighted by credit hours. With equal weights it is the ordinary mean.",
        symbols: [
          { sym: "w_i", means: "The weight given to observation i" },
          { sym: "x_i", means: "The i-th value" },
        ],
      },
      {
        id: "sample-variance",
        name: "Sample variance and standard deviation",
        tex: L`s^2=\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2,\qquad s=\sqrt{s^2}`,
        meaning:
          "The average squared distance from the mean, using n − 1 so that it does not underestimate the population variance. The standard deviation s is in the data’s own units.",
        symbols: [
          { sym: "s", means: "Sample standard deviation" },
          { sym: "s²", means: "Sample variance, in squared units" },
          { sym: "x̄", means: "Sample mean" },
          { sym: "n", means: "Sample size; n − 1 is the degrees of freedom" },
          { sym: "x_i", means: "The i-th observation" },
        ],
      },
      {
        id: "z-score",
        name: "z-score",
        tex: L`z=\frac{x-\mu}{\sigma}`,
        meaning:
          "How many standard deviations a value lies above (positive) or below (negative) the mean. Use the sample mean and s when the population values are unknown.",
        symbols: [
          { sym: "z", means: "The standardized score, with no units" },
          { sym: "x", means: "The value being standardized" },
          { sym: "μ", means: "Mean of the group" },
          { sym: "σ", means: "Standard deviation of the group" },
        ],
      },
      {
        id: "iqr-fences",
        name: "Interquartile range and outlier fences",
        tex: L`\mathrm{IQR}=Q_3-Q_1,\qquad \text{fences: } Q_1-1.5\,\mathrm{IQR},\ \ Q_3+1.5\,\mathrm{IQR}`,
        meaning:
          "The width of the middle half of the data. Points beyond the fences are flagged as possible outliers by Tukey’s rule. Different software computes quartiles slightly differently.",
        symbols: [
          { sym: "Q_1", means: "First quartile: 25% of the data lies below it" },
          { sym: "Q_3", means: "Third quartile: 75% of the data lies below it" },
          { sym: "IQR", means: "Interquartile range" },
        ],
      },
      {
        id: "coefficient-variation",
        name: "Coefficient of variation",
        tex: L`\mathrm{CV}=\frac{s}{\bar{x}}\times 100\%`,
        meaning:
          "Spread relative to the size of the mean, so variability can be compared across different units or scales. Meaningful only for positive ratio-scale data.",
        symbols: [
          { sym: "s", means: "Sample standard deviation" },
          { sym: "x̄", means: "Sample mean" },
          { sym: "CV", means: "Coefficient of variation, as a percentage" },
        ],
      },
      {
        id: "pearson-r",
        name: "Pearson correlation",
        tex: L`r=\frac{\sum_{i}(x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_{i}(x_i-\bar{x})^2}\,\sqrt{\sum_{i}(y_i-\bar{y})^2}}`,
        meaning:
          "Strength and direction of the straight-line relationship between two variables, from −1 to +1. It is unchanged by shifting or rescaling either variable.",
        symbols: [
          { sym: "r", means: "Sample correlation coefficient" },
          { sym: "x_i, y_i", means: "The paired values for observation i" },
          { sym: "x̄, ȳ", means: "The means of x and of y" },
        ],
      },
    ],
    examples: [
      {
        title: "Mean, median, and standard deviation",
        prompt: "Find the mean, median, and sample standard deviation of 2, 4, 4, 5, 7, 8.",
        steps: [
          "Mean: (2 + 4 + 4 + 5 + 7 + 8) / 6 = 30 / 6 = 5.",
          "Median: six values, so average the 3rd and 4th: (4 + 5) / 2 = 4.5.",
          "Deviations from 5: −3, −1, −1, 0, 2, 3. They sum to 0, as they always do.",
          "Squared deviations: 9, 1, 1, 0, 4, 9, which sum to 24.",
          "s² = 24 / (6 − 1) = 4.8, so s = √4.8 ≈ 2.19.",
        ],
        answer:
          "Mean 5, median 4.5, standard deviation about 2.19. The mean sits a little above the median because of the larger values 7 and 8.",
      },
      {
        title: "One extreme value",
        prompt:
          "Six salaries, in thousands: 30, 32, 35, 38, 40, and 400. Compare the mean and the median.",
        steps: [
          "Sum: 30 + 32 + 35 + 38 + 40 + 400 = 575.",
          "Mean: 575 / 6 ≈ 95.8 thousand.",
          "Median: sorted, the middle pair is 35 and 38, so (35 + 38) / 2 = 36.5 thousand.",
        ],
        answer:
          "Mean about 95.8, median 36.5. Five of the six people earn less than half the mean. For skewed data like income, the median describes a typical member and the mean does not.",
      },
      {
        title: "Comparing scores with z",
        prompt:
          "Ana scores 88 on an exam with mean 72 and standard deviation 8. Ben scores 72 on a different exam with mean 60 and standard deviation 5. Who did better relative to their class?",
        steps: ["Ana: z = (88 − 72) / 8 = 16 / 8 = 2.0.", "Ben: z = (72 − 60) / 5 = 12 / 5 = 2.4."],
        answer:
          "Ben, at 2.4 standard deviations above his class mean, against Ana’s 2.0, even though his raw score is lower.",
      },
      {
        title: "Finding an outlier",
        prompt: "Use Tukey’s fences to check 3, 5, 7, 8, 9, 11, 13, 15, 40 for outliers.",
        steps: [
          "Nine sorted values; the median is the 5th, 9.",
          "Lower half 3, 5, 7, 8 gives Q1 = (5 + 7) / 2 = 6. Upper half 11, 13, 15, 40 gives Q3 = (13 + 15) / 2 = 14.",
          "IQR = 14 − 6 = 8, and 1.5 × IQR = 12.",
          "Fences: 6 − 12 = −6 and 14 + 12 = 26.",
        ],
        answer:
          "40 lies above 26, so it is flagged. Check whether it is a recording error before deciding what to do with it.",
      },
      {
        title: "A small correlation",
        prompt: "Compute r for the pairs (1, 2), (2, 4), (3, 5), (4, 4), (5, 5).",
        steps: [
          "Means: x̄ = 3, ȳ = 4.",
          "x deviations: −2, −1, 0, 1, 2. y deviations: −2, 0, 1, 0, 1.",
          "Sum of products: 4 + 0 + 0 + 0 + 2 = 6.",
          "Sum of squared x deviations: 10. Sum of squared y deviations: 4 + 0 + 1 + 0 + 1 = 6.",
          "r = 6 / √(10 × 6) = 6 / √60 ≈ 0.775.",
        ],
        answer:
          "r ≈ 0.77, a fairly strong positive linear association. With five points, one changed value could move it a lot.",
      },
    ],
    practice: [
      {
        q: "Find the mean, median, and mode of 1, 3, 3, 6, 12.",
        a: "Mean 25 / 5 = 5. Median 3, the middle value. Mode 3. The mean is above the median because 12 stretches the right tail.",
      },
      {
        q: "Why does the sample variance divide by n − 1 instead of n?",
        a: "The deviations are measured from the sample mean, which is itself fitted to the data, so they sit closer to it than to the true mean. Only n − 1 deviations are free once the mean is fixed. Dividing by n − 1 removes the resulting downward bias in the variance.",
      },
      {
        q: "Machine A fills bags with mean 50 g and standard deviation 5 g. Machine B fills mean 200 g, standard deviation 10 g. Which is more consistent relative to its target?",
        a: "CV for A is 5 / 50 = 10%. CV for B is 10 / 200 = 5%. B is more consistent relative to its size, even though its standard deviation is larger.",
      },
      {
        q: "A course grade is 20% homework (90), 50% exams (80), and 30% project (70). What is the grade?",
        a: "0.2 × 90 + 0.5 × 80 + 0.3 × 70 = 18 + 40 + 21 = 79. The ordinary mean, 80, would ignore the weights.",
      },
      {
        q: "Ice cream sales and drownings have a correlation of 0.8 across the months of a year. Does ice cream cause drowning?",
        a: "No. Both rise in hot weather. Temperature is a confounding variable that drives both. Correlation describes association; it does not identify cause.",
      },
    ],
    pitfalls: [
      "Reporting a mean for skewed data, such as income, house prices, or hospital stays, as if it were typical. Give the median, or both.",
      "Taking an average of a categorical code. The mean of zip codes or jersey numbers is a meaningless number.",
      "Averaging averages. The mean of two class means is not the overall mean unless the classes are the same size; weight by size.",
      "Deleting outliers because they are inconvenient. Remove a point only for a documented reason, such as a measurement error, and say so.",
      "Trusting summaries without a plot. Very different data sets can share the same mean, standard deviation, and correlation.",
      "Reading correlation as causation, or reading r = 0 as “no relationship.” r only measures straight-line association.",
      "Mixing up the population standard deviation (divide by n) and the sample standard deviation (divide by n − 1). Calculators label them σ and s.",
    ],
  },
  {
    slug: "statistical-inference",
    volume: "statistics",
    level: "intermediate",
    title: "Inference: from a sample to the population",
    minutes: 50,
    summary:
      "Intermediate statistics: sampling distributions, standard errors, confidence intervals, hypothesis tests and p-values, and the first regression line, with the assumptions each one rests on.",
    prereqs: ["descriptive-statistics", "probability"],
    ideas: [
      "A statistic varies from sample to sample. Its sampling distribution says by how much.",
      "The standard error shrinks like one over the square root of n. Four times the data halves the uncertainty.",
      "A confidence interval describes the method: 95% of intervals built this way would contain the true value.",
      "A p-value is the probability of data at least this extreme if the null hypothesis were true. It is not the probability that the null is true.",
      "Every test assumes something, usually independence and a sampling method. Check the assumptions before the arithmetic.",
    ],
    body: [
      "Inference asks what a sample can tell you about a population you did not fully observe. The key idea is that a statistic, such as the sample mean, is itself a random quantity: draw a different random sample and you get a different value. The distribution of that value over all possible samples is the sampling distribution. Its standard deviation is called the standard error. For the mean of n independent observations with standard deviation σ, the standard error is σ divided by the square root of n. Precision grows slowly: to halve the standard error you need four times as much data.",
      "The central limit theorem says that for large enough samples, the sampling distribution of the mean is approximately normal, whatever the shape of the original data. That is why so many methods use the normal curve. How large is large enough depends on the skew: 30 is a common rule of thumb for mild skew, but heavily skewed data, such as incomes or insurance claims, can need far more. When σ is unknown and estimated by s, the standardized mean follows a t distribution with n − 1 degrees of freedom, which has heavier tails than the normal and widens intervals for small samples.",
      "A confidence interval gives a range of plausible values for a parameter: estimate plus or minus a critical value times the standard error. The 95% describes the procedure, not this particular interval. If you repeated the study many times, about 95% of the intervals would contain the true value. A given interval either contains it or it does not; you just do not know which. Wider intervals come from more variable data, smaller samples, or higher confidence levels.",
      "A hypothesis test starts from a null hypothesis, usually “no effect” or “no difference,” and asks how surprising the data would be if it were true. The p-value is the probability, assuming the null, of a test statistic at least as extreme as the one observed. A small p-value means the data would be unusual under the null. It does not give the probability that the null is true, it does not measure the size of the effect, and p = 0.05 is a convention, not a law of nature. Rejecting a true null is a Type I error, with probability α, the significance level. Failing to reject a false null is a Type II error, with probability β. The power of a test, 1 − β, is its chance of detecting an effect that really exists, and it grows with sample size and effect size.",
      "Different questions use different test statistics. A t test compares a mean with a value, or two means with each other. A chi-square test compares observed counts with the counts a hypothesis predicts. Simple linear regression fits the straight line ŷ = a + bx that minimizes the sum of squared vertical distances, the residuals, between the data and the line. Its R² is the fraction of the variance in y that the line accounts for. All of these assume independent observations, a sampling or assignment process that justifies generalizing, and usually some condition on shape, such as roughly normal residuals or expected counts of at least 5. A test applied to data that violates its assumptions produces a precise-looking number with no guarantee behind it.",
    ],
    formulas: [
      {
        id: "standard-error",
        name: "Standard error of the mean",
        tex: L`\mathrm{SE}(\bar{x})=\frac{\sigma}{\sqrt{n}}\approx\frac{s}{\sqrt{n}}`,
        meaning:
          "How much the sample mean varies from sample to sample. It shrinks with the square root of the sample size, and assumes independent observations.",
        symbols: [
          { sym: "SE", means: "Standard error" },
          { sym: "σ", means: "Population standard deviation" },
          { sym: "s", means: "Sample standard deviation, used when σ is unknown" },
          { sym: "n", means: "Sample size" },
        ],
      },
      {
        id: "ci-mean",
        name: "Confidence interval for a mean",
        tex: L`\bar{x}\pm t^{*}_{n-1}\,\frac{s}{\sqrt{n}}`,
        meaning:
          "Estimate plus or minus a margin of error. For 95% confidence and large n, t* is close to 1.96.",
        symbols: [
          { sym: "x̄", means: "Sample mean" },
          {
            sym: "t^*",
            means: "Critical value from the t distribution for the chosen confidence level",
          },
          { sym: "s", means: "Sample standard deviation" },
          { sym: "n", means: "Sample size; n − 1 is the degrees of freedom" },
        ],
      },
      {
        id: "ci-proportion",
        name: "Confidence interval for a proportion",
        tex: L`\hat{p}\pm z^{*}\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`,
        meaning:
          "The large-sample interval for a population proportion. It needs at least about 10 successes and 10 failures, and a random sample.",
        symbols: [
          { sym: "p̂", means: "Sample proportion, read “p hat”" },
          { sym: "z^*", means: "Normal critical value: 1.96 for 95%" },
          { sym: "n", means: "Sample size" },
        ],
      },
      {
        id: "one-sample-t",
        name: "One-sample t statistic",
        tex: L`t=\frac{\bar{x}-\mu_0}{s/\sqrt{n}}`,
        meaning:
          "How many standard errors the sample mean is from the hypothesized mean. Compare with a t distribution on n − 1 degrees of freedom.",
        symbols: [
          { sym: "t", means: "Test statistic" },
          { sym: "x̄", means: "Sample mean" },
          { sym: "μ_0", means: "Mean claimed by the null hypothesis" },
          { sym: "s", means: "Sample standard deviation" },
          { sym: "n", means: "Sample size" },
        ],
      },
      {
        id: "welch-t",
        name: "Two-sample (Welch) t statistic",
        tex: L`t=\frac{\bar{x}_1-\bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1}+\dfrac{s_2^2}{n_2}}}`,
        meaning:
          "Compares two independent group means without assuming equal variances. The degrees of freedom come from the Welch–Satterthwaite formula, which software computes.",
        symbols: [
          { sym: "x̄_1, x̄_2", means: "The two group means" },
          { sym: "s_1, s_2", means: "The two group standard deviations" },
          { sym: "n_1, n_2", means: "The two group sizes" },
        ],
      },
      {
        id: "chi-square",
        name: "Chi-square statistic",
        tex: L`\chi^2=\sum_{i}\frac{(O_i-E_i)^2}{E_i}`,
        meaning:
          "Measures how far observed counts are from expected counts. Use counts, not percentages, and keep each expected count at about 5 or more.",
        symbols: [
          { sym: "χ²", means: "Chi-square test statistic" },
          { sym: "O_i", means: "Observed count in category i" },
          { sym: "E_i", means: "Expected count in category i under the null hypothesis" },
        ],
      },
      {
        id: "least-squares-line",
        name: "Least-squares regression line",
        tex: L`\hat{y}=a+bx,\qquad b=r\,\frac{s_y}{s_x},\qquad a=\bar{y}-b\,\bar{x}`,
        meaning:
          "The straight line that minimizes the sum of squared residuals. It always passes through the point of means. The slope is the predicted change in y per unit of x.",
        symbols: [
          { sym: "ŷ", means: "Predicted value of y" },
          { sym: "a", means: "Intercept: predicted y when x = 0" },
          { sym: "b", means: "Slope" },
          { sym: "r", means: "Correlation between x and y" },
          { sym: "s_x, s_y", means: "Standard deviations of x and of y" },
          { sym: "x̄, ȳ", means: "Means of x and of y" },
        ],
      },
      {
        id: "sample-size-proportion",
        name: "Sample size for a margin of error",
        tex: L`n=\frac{(z^{*})^2\,p(1-p)}{m^2}`,
        meaning:
          "Sample size needed to estimate a proportion within margin m. With no prior guess, p = 0.5 gives the largest, safest n. Round up.",
        symbols: [
          { sym: "n", means: "Required sample size" },
          { sym: "z^*", means: "Normal critical value for the confidence level" },
          { sym: "p", means: "A planning guess for the proportion" },
          { sym: "m", means: "Desired margin of error" },
        ],
      },
    ],
    examples: [
      {
        title: "A confidence interval for a mean",
        prompt:
          "A random sample of 36 bolts has mean length 100 mm and standard deviation 12 mm. Give a 95% confidence interval for the mean length.",
        steps: [
          "Standard error: 12 / √36 = 12 / 6 = 2 mm.",
          "With 35 degrees of freedom, t* ≈ 2.03.",
          "Margin of error: 2.03 × 2 ≈ 4.06 mm.",
          "Interval: 100 − 4.06 to 100 + 4.06.",
        ],
        answer:
          "About 95.9 mm to 104.1 mm. If the study were repeated many times, about 95% of intervals built this way would contain the true mean.",
      },
      {
        title: "A poll",
        prompt:
          "In a random sample of 1000 voters, 520 support a measure. Give a 95% interval. Can you say a majority supports it?",
        steps: [
          "p̂ = 520 / 1000 = 0.52.",
          "SE = √(0.52 × 0.48 / 1000) ≈ 0.0158.",
          "Margin: 1.96 × 0.0158 ≈ 0.031.",
          "Interval: 0.489 to 0.551.",
        ],
        answer:
          "About 48.9% to 55.1%. The interval includes 50%, so the data does not establish a majority, even though the estimate is above half.",
      },
      {
        title: "A one-sample t test",
        prompt:
          "Bags are labelled 500 g. A sample of 16 has mean 494 g and standard deviation 8 g. Is the mean below 500 g?",
        steps: [
          "Null hypothesis: μ = 500. Alternative: μ ≠ 500.",
          "SE = 8 / √16 = 2 g.",
          "t = (494 − 500) / 2 = −3.0, with 15 degrees of freedom.",
          "The two-sided p-value for |t| = 3.0 on 15 degrees of freedom is about 0.009.",
        ],
        answer:
          "p ≈ 0.009, so reject the null at the 5% level. The 95% interval, 494 ± 2.13 × 2, about 489.7 to 498.3 g, tells you the size of the shortfall too.",
      },
      {
        title: "Is the die fair?",
        prompt:
          "A die is rolled 60 times. The faces 1 to 6 come up 5, 8, 9, 8, 10, and 20 times. Test whether the die is fair.",
        steps: [
          "Under fairness, each face is expected 60 / 6 = 10 times.",
          "Contributions (O − E)² / E: 2.5, 0.4, 0.1, 0.4, 0, and 10.",
          "χ² = 13.4, with 6 − 1 = 5 degrees of freedom.",
          "The 5% critical value for 5 degrees of freedom is 11.07. The p-value is about 0.02.",
        ],
        answer:
          "Reject fairness at the 5% level. Almost all of the evidence comes from the six, which appeared twice as often as expected.",
      },
      {
        title: "Fitting a line",
        prompt:
          "For the pairs (1, 2), (2, 4), (3, 5), (4, 4), (5, 5), find the least-squares line and R².",
        steps: [
          "From the correlation example: sum of xy deviation products is 6, and the sum of squared x deviations is 10.",
          "Slope b = 6 / 10 = 0.6.",
          "Intercept a = ȳ − b x̄ = 4 − 0.6 × 3 = 2.2.",
          "R² = r² = 0.775² ≈ 0.6.",
        ],
        answer:
          "ŷ = 2.2 + 0.6x. The line accounts for about 60% of the variance in y. Do not use it to predict far outside x from 1 to 5.",
      },
      {
        title: "Planning a survey",
        prompt:
          "How many people must a random survey include to estimate a proportion within 3 percentage points at 95% confidence?",
        steps: [
          "With no prior guess, use p = 0.5, which makes p(1 − p) as large as possible.",
          "n = 1.96² × 0.25 / 0.03² = 0.9604 / 0.0009 ≈ 1067.1.",
          "Round up.",
        ],
        answer:
          "1068 people. This covers only random sampling error. It does nothing about a biased sampling frame or people who refuse to answer.",
      },
    ],
    practice: [
      {
        q: "A study’s standard error is 4. How much bigger must the sample be to make it 2?",
        a: "Four times bigger. The standard error scales like 1 / √n, so halving it needs four times the data.",
      },
      {
        q: "A test gives p = 0.03. A classmate says there is a 3% chance the null hypothesis is true. What is wrong?",
        a: "The p-value is computed assuming the null is true: it is the probability of data at least this extreme under the null, not the probability of the null given the data. Getting that would take a prior and Bayes’ theorem.",
      },
      {
        q: "A drug that works is tested, and the trial finds no significant effect. What kind of error is this, and what makes it more likely?",
        a: "A Type II error, failing to reject a false null. It is more likely with small samples, noisy measurements, small true effects, and a strict significance level. Low power is the usual cause.",
      },
      {
        q: "Group A: n = 25, mean 82, s = 10. Group B: n = 25, mean 76, s = 10. Compute the Welch t statistic.",
        a: "SE = √(100/25 + 100/25) = √8 ≈ 2.83. t = (82 − 76) / 2.83 ≈ 2.12, with about 48 degrees of freedom, giving a two-sided p of about 0.04.",
      },
      {
        q: "A 95% interval for a mean is 10 to 14. Is it right to say there is a 95% chance the true mean is between 10 and 14?",
        a: "Not in the frequentist sense. The true mean is fixed; the interval is what is random. The 95% describes how often the method captures the true mean in repeated samples.",
      },
    ],
    pitfalls: [
      "Treating p < 0.05 as proof and p > 0.05 as proof of no effect. Absence of evidence is not evidence of absence, especially in a small study.",
      "Confusing statistical significance with practical importance. With a huge sample, a trivial difference can have a tiny p-value. Always report the effect size and an interval.",
      "Ignoring independence. Repeated measurements on the same people, students in the same class, or days in a time series are not independent, and standard errors that assume they are come out too small.",
      "Using a two-sample test on paired data, or a paired test on independent groups. The design decides the test.",
      "Running chi-square on percentages instead of counts, or with expected counts far below 5.",
      "Extrapolating a regression line outside the range of the data, or reading its slope as the effect of changing x.",
      "Generalizing from a convenience sample. The formulas assume random sampling; volunteers and website polls do not satisfy it.",
    ],
  },
  {
    slug: "statistical-modeling",
    volume: "statistics",
    level: "advanced",
    title: "Models, likelihood, and Bayesian inference",
    minutes: 60,
    summary:
      "Advanced statistics: multiple regression in matrix form, maximum likelihood, Bayesian updating, logistic regression, effect sizes and power, multiple testing corrections, model selection, and the resampling ideas behind modern practice.",
    prereqs: ["statistical-inference", "linear-algebra", "differential-calculus"],
    ideas: [
      "A model is a set of assumptions about how the data was generated. Every estimate inherits them.",
      "Likelihood turns a model and data into a function of the unknown parameters. Its peak is the maximum likelihood estimate.",
      "Bayesian inference combines the likelihood with a prior to give a full distribution for the parameters.",
      "Testing many hypotheses guarantees false positives unless you control for it.",
      "A model that fits the data it was trained on is not yet a model that predicts. Validate on data it has not seen.",
    ],
    body: [
      "A statistical model says how the data could have been generated, up to some unknown parameters. Multiple linear regression models an outcome as a weighted sum of several predictors plus random error: y = Xβ + ε. The least-squares estimate β̂ = (XᵀX)⁻¹Xᵀy is the projection of y onto the space spanned by the predictor columns. Each coefficient is the predicted change in y for a one-unit change in that predictor with the others held fixed, which is a statement about the model, not a promise that you could change one predictor alone in the real world. When predictors are strongly correlated with each other, multicollinearity, XᵀX is nearly singular and the individual coefficients become unstable, even if the predictions are fine.",
      "Maximum likelihood is the general recipe for fitting models. Write the probability of the observed data as a function of the parameters, the likelihood L(θ), and choose the θ that makes it largest. In practice you maximize the log-likelihood, which turns products into sums. For normal errors, maximum likelihood gives exactly least squares. For a yes-or-no outcome, it gives logistic regression, which models the log-odds as a linear function of the predictors so that predicted probabilities stay between 0 and 1. Under regularity conditions, maximum likelihood estimates are consistent and approximately normal in large samples, with standard errors from the curvature of the log-likelihood at its peak.",
      "Bayesian inference treats the parameter itself as uncertain and describes that uncertainty with a probability distribution. Start with a prior p(θ), multiply by the likelihood, and normalize to get the posterior p(θ | data). The posterior answers the question people usually want answered: given this data, how probable is each value of the parameter? A 95% credible interval contains the parameter with 95% posterior probability. The cost is that the answer depends on the prior. With plenty of data the likelihood dominates and reasonable priors agree; with little data, the prior matters, and it should be stated and checked for sensitivity. Conjugate pairs, such as a beta prior with a binomial likelihood, give closed-form updates; most real models use Markov chain Monte Carlo to sample from the posterior.",
      "A p-value says nothing about how big an effect is. An effect size does: Cohen’s d expresses a difference in means in units of the standard deviation, and an odds ratio or a risk difference does the same job for binary outcomes. Power analysis, done before collecting data, asks how large a sample is needed to detect the smallest effect worth caring about. Underpowered studies are not merely likely to miss real effects; the effects they do report as significant tend to be exaggerated, because only the lucky overestimates cross the threshold. When many hypotheses are tested, the chance of at least one false positive grows quickly. The Bonferroni correction controls that family-wise error rate by testing each hypothesis at α / m. The Benjamini–Hochberg procedure instead controls the false discovery rate, the expected fraction of rejected hypotheses that are false, and keeps far more power when m is large.",
      "More parameters always fit the training data better, so fit alone cannot choose a model. Information criteria such as AIC and BIC reward fit and penalize complexity, BIC more heavily as n grows. Cross-validation estimates predictive performance directly: fit the model on part of the data and measure its error on the part held out, rotating through the folds. The bootstrap estimates the sampling variability of almost any statistic by resampling the observed data with replacement many times and recomputing the statistic each time; the spread of those recomputed values approximates the standard error. Finally, none of these tools turns association into causation. A randomized experiment balances confounders by design. With observational data, causal claims require an explicit argument, often drawn as a causal diagram, about which variables to adjust for, and which, like colliders and mediators, must not be adjusted for.",
    ],
    formulas: [
      {
        id: "ols-matrix",
        name: "Least squares in matrix form",
        tex: L`\hat{\boldsymbol\beta}=(X^{\mathsf T}X)^{-1}X^{\mathsf T}\mathbf{y}`,
        meaning:
          "The coefficient vector that minimizes the sum of squared residuals for the model y = Xβ + ε. Requires XᵀX to be invertible: no predictor may be an exact combination of the others.",
        symbols: [
          { sym: "β̂", means: "Estimated coefficient vector" },
          {
            sym: "X",
            means:
              "Design matrix: one row per observation, one column per predictor, plus a column of ones for the intercept",
          },
          { sym: "Xᵀ", means: "Transpose of X" },
          { sym: "y", means: "Vector of observed outcomes" },
        ],
      },
      {
        id: "log-likelihood",
        name: "Log-likelihood and the MLE",
        tex: L`\ell(\theta)=\sum_{i=1}^{n}\log f(x_i\mid\theta),\qquad \hat\theta=\arg\max_{\theta}\,\ell(\theta)`,
        meaning:
          "The log of the probability of the observed data, as a function of the parameter. The maximum likelihood estimate is the parameter value that makes the data most probable. Assumes independent observations.",
        symbols: [
          { sym: "ℓ", means: "Log-likelihood" },
          { sym: "θ", means: "Unknown parameter, or vector of parameters" },
          { sym: "θ̂", means: "Maximum likelihood estimate" },
          { sym: "f", means: "Probability or density of one observation under the model" },
          { sym: "x_i", means: "The i-th observation" },
        ],
      },
      {
        id: "posterior",
        name: "Bayes’ rule for parameters",
        tex: L`p(\theta\mid x)=\frac{p(x\mid\theta)\,p(\theta)}{p(x)}\;\propto\;p(x\mid\theta)\,p(\theta)`,
        meaning:
          "Posterior is proportional to likelihood times prior. The denominator only rescales so the posterior integrates to 1.",
        symbols: [
          { sym: "p(θ | x)", means: "Posterior: belief about θ after seeing the data" },
          { sym: "p(x | θ)", means: "Likelihood of the data for a given θ" },
          { sym: "p(θ)", means: "Prior: belief about θ before the data" },
          { sym: "∝", means: "Is proportional to" },
        ],
      },
      {
        id: "beta-binomial",
        name: "Beta–binomial update",
        tex: L`\mathrm{Beta}(\alpha,\beta)\;\xrightarrow{\;k\text{ of }n\;}\;\mathrm{Beta}(\alpha+k,\ \beta+n-k),\qquad E[p]=\frac{\alpha+k}{\alpha+\beta+n}`,
        meaning:
          "A beta prior on a success probability, updated by k successes in n trials, gives another beta. The prior acts like α earlier successes and β earlier failures.",
        symbols: [
          { sym: "α, β", means: "Prior shape parameters: pseudo-counts of successes and failures" },
          { sym: "k", means: "Observed successes" },
          { sym: "n", means: "Number of trials" },
          { sym: "p", means: "Unknown success probability" },
        ],
      },
      {
        id: "logistic",
        name: "Logistic regression",
        tex: L`\log\frac{p}{1-p}=\beta_0+\beta_1x,\qquad p=\frac{1}{1+e^{-(\beta_0+\beta_1x)}}`,
        meaning:
          "Models the log-odds of a yes outcome as linear in x. Each unit increase in x multiplies the odds by e to the β₁, the odds ratio.",
        symbols: [
          { sym: "p", means: "Probability of the outcome" },
          { sym: "β_0", means: "Intercept on the log-odds scale" },
          { sym: "β_1", means: "Change in log-odds per unit of x" },
          { sym: "x", means: "Predictor" },
          { sym: "e", means: "Base of the natural logarithm" },
        ],
      },
      {
        id: "cohens-d",
        name: "Cohen’s d and sample size for power",
        tex: L`d=\frac{\bar{x}_1-\bar{x}_2}{s_p},\qquad n_{\text{per group}}\approx\frac{2\,(z_{1-\alpha/2}+z_{1-\beta})^2}{d^2}`,
        meaning:
          "The difference in means in standard-deviation units, and the approximate sample size per group to detect it with power 1 − β. For α = 0.05 and 80% power the z values are 1.96 and 0.84.",
        symbols: [
          { sym: "d", means: "Standardized effect size" },
          { sym: "s_p", means: "Pooled standard deviation of the two groups" },
          { sym: "α", means: "Significance level (Type I error rate)" },
          { sym: "β", means: "Type II error rate; power is 1 − β" },
          { sym: "z", means: "Standard normal quantile" },
        ],
      },
      {
        id: "multiple-testing",
        name: "Bonferroni and Benjamini–Hochberg",
        tex: L`\text{Bonferroni: } p_i\le\frac{\alpha}{m}\qquad \text{BH: reject } p_{(1)},\dots,p_{(k)},\ \ k=\max\Big\{i: p_{(i)}\le\frac{i}{m}\,q\Big\}`,
        meaning:
          "Bonferroni controls the chance of any false positive across m tests. Benjamini–Hochberg sorts the p-values and controls the expected share of false discoveries at q.",
        symbols: [
          { sym: "m", means: "Number of hypotheses tested" },
          { sym: "α", means: "Family-wise error rate to control" },
          { sym: "p_(i)", means: "The i-th smallest p-value" },
          { sym: "q", means: "Target false discovery rate" },
        ],
      },
      {
        id: "aic-bic",
        name: "Information criteria",
        tex: L`\mathrm{AIC}=2k-2\ell(\hat\theta),\qquad \mathrm{BIC}=k\ln n-2\ell(\hat\theta)`,
        meaning:
          "Lower is better. Both reward fit through the maximized log-likelihood and penalize the number of parameters. Compare only models fitted to the same data.",
        symbols: [
          { sym: "k", means: "Number of estimated parameters" },
          { sym: "ℓ", means: "Maximized log-likelihood" },
          { sym: "n", means: "Number of observations" },
        ],
      },
    ],
    examples: [
      {
        title: "Maximum likelihood for a coin",
        prompt:
          "A coin lands heads 7 times in 10 flips. Find the maximum likelihood estimate of p.",
        steps: [
          "Likelihood: L(p) = C(10, 7) p⁷ (1 − p)³.",
          "Log-likelihood: ℓ(p) = constant + 7 ln p + 3 ln(1 − p).",
          "Set the derivative to zero: 7 / p − 3 / (1 − p) = 0.",
          "Solve: 7(1 − p) = 3p, so p = 7 / 10.",
        ],
        answer:
          "p̂ = 0.7, the sample proportion. With only 10 flips, the standard error √(0.7 × 0.3 / 10) ≈ 0.14 is large.",
      },
      {
        title: "A Bayesian update",
        prompt:
          "Start with a Beta(2, 2) prior on the same coin’s p, gently centered on 0.5. Update on 7 heads in 10 flips.",
        steps: [
          "Posterior: Beta(2 + 7, 2 + 3) = Beta(9, 5).",
          "Posterior mean: 9 / (9 + 5) = 9 / 14 ≈ 0.643.",
        ],
        answer:
          "About 0.64, pulled from 0.7 toward the prior’s 0.5. With 1000 flips at the same rate, the prior would barely matter.",
      },
      {
        title: "Twenty tests",
        prompt:
          "A study tests 20 independent outcomes at α = 0.05, and none has a real effect. What is the chance of at least one significant result? What threshold does Bonferroni use?",
        steps: [
          "P(no false positives) = 0.95²⁰ ≈ 0.358.",
          "P(at least one) = 1 − 0.358 ≈ 0.642.",
          "Bonferroni threshold: 0.05 / 20 = 0.0025.",
        ],
        answer:
          "About 64%. A “significant” finding among 20 uncorrected tests is close to expected by chance. Test each at 0.0025 to keep the family-wise rate near 5%.",
      },
      {
        title: "Benjamini–Hochberg by hand",
        prompt:
          "Ten sorted p-values: 0.001, 0.008, 0.039, 0.041, 0.042, 0.06, 0.074, 0.205, 0.212, 0.216. Control the false discovery rate at q = 0.05.",
        steps: [
          "Thresholds (i / 10) × 0.05: 0.005, 0.010, 0.015, 0.020, 0.025, and so on.",
          "p₁ = 0.001 ≤ 0.005 and p₂ = 0.008 ≤ 0.010 pass.",
          "p₃ = 0.039 > 0.015, and no later p-value falls under its threshold either.",
          "So k = 2.",
        ],
        answer:
          "Reject the first two. Uncorrected, five p-values are below 0.05. Bonferroni, at 0.005, would reject only the first.",
      },
      {
        title: "Reading a logistic model",
        prompt:
          "A model gives log-odds of passing = −3 + 0.8 × (hours studied). What is the predicted probability of passing after 5 hours, and what does 0.8 mean?",
        steps: [
          "Log-odds at 5 hours: −3 + 0.8 × 5 = 1.",
          "p = 1 / (1 + e⁻¹) ≈ 1 / 1.368 ≈ 0.731.",
          "Odds ratio per hour: e^0.8 ≈ 2.23.",
        ],
        answer:
          "About 73%. Each extra hour multiplies the odds of passing by about 2.2. It does not add a fixed amount to the probability.",
      },
      {
        title: "How many participants?",
        prompt:
          "You expect a difference of 6 points between groups with a standard deviation of 10. How many people per group give 80% power at α = 0.05?",
        steps: [
          "Effect size d = 6 / 10 = 0.6.",
          "n ≈ 2 × (1.96 + 0.84)² / 0.6² = 2 × 7.84 / 0.36 ≈ 43.6.",
          "Round up.",
        ],
        answer:
          "About 44 per group. If the true effect is half as big, d = 0.3, you would need about four times as many.",
      },
    ],
    practice: [
      {
        q: "Model A has log-likelihood −120 with 3 parameters. Model B has −118 with 6. Which does AIC prefer?",
        a: "AIC(A) = 6 + 240 = 246. AIC(B) = 12 + 236 = 248. A has the lower AIC: B’s better fit does not pay for three extra parameters.",
      },
      {
        q: "Describe how to bootstrap a standard error for a sample median.",
        a: "Draw a sample of the same size from the data with replacement, compute its median, and repeat many times, say 5000. The standard deviation of those medians estimates the standard error. The percentiles of them give a rough confidence interval.",
      },
      {
        q: "Why can a regression have a high R² while every individual coefficient has a large standard error?",
        a: "Multicollinearity. When predictors are highly correlated, together they predict y well, but the data cannot separate their individual contributions, so each coefficient is poorly determined.",
      },
      {
        q: "A tiny pilot study finds a large, significant effect. Why should you expect the follow-up to find a smaller one?",
        a: "In an underpowered study, only results that happen to overestimate the effect reach significance. That selection exaggerates the reported effect, sometimes called the winner’s curse or a Type M error. Larger studies regress toward the true value.",
      },
      {
        q: "In a study of hospital patients, two diseases appear negatively associated, although they are independent in the population. What could cause this?",
        a: "Collider bias, also called Berkson’s paradox. Either disease can put someone in hospital, so conditioning on being a patient creates a spurious association between them.",
      },
    ],
    pitfalls: [
      "Interpreting a coefficient as a causal effect. Regression coefficients describe associations conditional on the other predictors in the model.",
      "Adjusting for every available variable. Controlling for a mediator removes part of the effect you want, and controlling for a collider creates bias out of nothing.",
      "Choosing the model, the outcome, or the subgroup after seeing the data, then reporting the p-value as if the choice had been made in advance.",
      "Measuring predictive accuracy on the training data. Use held-out data or cross-validation; in-sample error is optimistic.",
      "Using a prior that silently decides the answer. State it, justify it, and show how the conclusion changes under reasonable alternatives.",
      "Running an underpowered study and treating a non-significant result as evidence of no effect, or a significant one as a reliable effect size.",
      "Leaking information from the test set into training, for example by scaling or selecting features using all the data before splitting it.",
    ],
  },
  {
    slug: "statistical-pitfalls",
    volume: "statistics",
    level: "advanced",
    title: "Where statistics goes wrong",
    minutes: 45,
    summary:
      "The theory behind the most common statistical errors: biased samples, confounding and Simpson’s paradox, base rates, regression to the mean, forking paths and p-hacking, misleading risk figures, and graphs that lie. What to check before you believe a number.",
    prereqs: ["descriptive-statistics", "statistical-inference"],
    ideas: [
      "Most statistical errors come from the data collection and the analysis choices, not from the arithmetic.",
      "Ask who is missing from the data, and why.",
      "Ask what else differs between the groups being compared.",
      "Ask how many analyses were tried before this one was reported.",
      "Ask for absolute numbers and base rates, not only relative changes.",
    ],
    body: [
      "No formula can fix a biased sample. Selection bias happens when the way units enter the data is related to the outcome. Online polls hear from people who care enough to click. Nonresponse bias happens when the people who decline differ from those who answer. Survivorship bias happens when only the survivors are visible: successful companies, buildings old enough to still be standing, the planes that returned from a mission. In the Second World War, the statistician Abraham Wald argued that armor should go where returning planes had no bullet holes, because planes hit there did not come back. A bigger biased sample only gives you a more precise wrong answer.",
      "Confounding is a third variable that affects both the supposed cause and the effect, creating an association with no direct link. Simpson’s paradox is its most striking form: a trend that appears in every subgroup can reverse when the subgroups are combined, because the groups are mixed in different proportions. The resolution is not a rule like “always use the subgroups.” It depends on the causal structure: whether the grouping variable is a confounder to adjust for, or a consequence of the treatment that should be left alone. Randomized assignment breaks the link between the treatment and every confounder, measured or not, which is why randomized experiments carry so much weight.",
      "Base rates matter. When a condition is rare, even an accurate test produces mostly false positives, because the small false-positive rate applies to the large number of people without the condition. The same arithmetic applies to fraud detection, security screening, and any search for rare events. Regression to the mean is another trap built into the data. When a measurement is partly noise, extreme values tend to be followed by less extreme ones. Students who score worst on one test usually improve on the next, with or without tutoring; a sports star’s record season is usually followed by a more ordinary one. Any intervention applied to the most extreme cases will look effective unless compared with a control group selected the same way.",
      "Analysis choices create their own errors. Every study involves decisions about which outcomes to measure, which participants to exclude, which covariates to include, and when to stop collecting data. If those choices are made after looking at the results, each one is a chance to find a significant p-value by luck: the garden of forking paths. Deliberate or not, this p-hacking makes the nominal 5% false-positive rate much higher. Publication bias adds to it, because journals and media favor striking positive results, so the published literature over-represents lucky findings. Preregistration of hypotheses and analysis plans, reporting every outcome measured, and replication are the main defenses.",
      "Even correct numbers can mislead in presentation. A relative risk reduction of 50% sounds dramatic, but if the risk falls from 2 in 1000 to 1 in 1000, the absolute reduction is one tenth of a percentage point, and a thousand people must be treated to prevent one case. Graphs mislead with truncated axes, inconsistent scales, cherry-picked time windows, and areas that grow with the square of the quantity shown. Group-level correlations do not license claims about individuals, the ecological fallacy. And when a statistic becomes a target, people optimize the statistic rather than what it measured, which is Goodhart’s law. The habit to build is a short list of questions you ask of every number: compared with what, out of how many, who is missing, and how many other analyses were run.",
    ],
    formulas: [
      {
        id: "ppv",
        name: "Positive predictive value",
        tex: L`\mathrm{PPV}=\frac{\text{sens}\cdot\pi}{\text{sens}\cdot\pi+(1-\text{spec})(1-\pi)}`,
        meaning:
          "The probability that a positive result is a true positive. It depends heavily on the base rate: the same test is far less trustworthy for a rare condition.",
        symbols: [
          { sym: "PPV", means: "Positive predictive value" },
          { sym: "sens", means: "Sensitivity: P(positive | condition)" },
          { sym: "spec", means: "Specificity: P(negative | no condition)" },
          { sym: "π", means: "Prevalence, the base rate of the condition" },
        ],
      },
      {
        id: "familywise-error",
        name: "Chance of at least one false positive",
        tex: L`P(\text{at least one false positive})=1-(1-\alpha)^m`,
        meaning:
          "For m independent tests of true null hypotheses, each at level α. It passes 50% at about 14 tests when α = 0.05.",
        symbols: [
          { sym: "α", means: "Significance level of each test" },
          { sym: "m", means: "Number of tests run" },
        ],
      },
      {
        id: "risk-measures",
        name: "Relative risk, absolute risk reduction, and NNT",
        tex: L`\mathrm{RR}=\frac{p_t}{p_c},\qquad \mathrm{ARR}=p_c-p_t,\qquad \mathrm{NNT}=\frac{1}{\mathrm{ARR}}`,
        meaning:
          "The same result three ways. Relative risk can make a tiny change sound large; the absolute reduction and the number needed to treat show its real size.",
        symbols: [
          { sym: "p_t", means: "Risk of the outcome in the treated group" },
          { sym: "p_c", means: "Risk of the outcome in the control group" },
          { sym: "RR", means: "Relative risk; 1 − RR is the relative risk reduction" },
          { sym: "ARR", means: "Absolute risk reduction" },
          { sym: "NNT", means: "Number needed to treat to prevent one outcome" },
        ],
      },
      {
        id: "regression-to-mean",
        name: "Regression to the mean",
        tex: L`E[\,Y\mid X=x\,]=\mu+\rho\,(x-\mu)`,
        meaning:
          "For two measurements with the same mean and spread and correlation ρ, the expected second value is pulled back toward the mean by the factor ρ. The less reliable the measurement, the stronger the pull.",
        symbols: [
          { sym: "X", means: "First measurement" },
          { sym: "Y", means: "Second measurement" },
          { sym: "μ", means: "Mean of both measurements" },
          { sym: "ρ", means: "Correlation between the two measurements" },
          { sym: "x", means: "The observed first value" },
        ],
      },
      {
        id: "simpson-weighting",
        name: "Why aggregate rates can reverse",
        tex: L`\bar{p}=\sum_{g} w_g\,p_g,\qquad w_g=\frac{n_g}{\sum_{h} n_h}`,
        meaning:
          "An overall rate is a weighted average of subgroup rates. If two treatments have very different mixes of subgroups, their overall rates can rank opposite to every subgroup comparison.",
        symbols: [
          { sym: "p̄", means: "Overall rate" },
          { sym: "p_g", means: "Rate in subgroup g" },
          { sym: "w_g", means: "Share of the cases that fall in subgroup g" },
          { sym: "n_g", means: "Number of cases in subgroup g" },
        ],
      },
    ],
    examples: [
      {
        title: "Screening for a rare condition",
        prompt:
          "A condition has prevalence 0.5%. A test has sensitivity 90% and specificity 95%. What fraction of positive results are true positives?",
        steps: [
          "True positives: 0.90 × 0.005 = 0.0045.",
          "False positives: 0.05 × 0.995 = 0.04975.",
          "PPV = 0.0045 / (0.0045 + 0.04975) ≈ 0.083.",
        ],
        answer:
          "About 8%. Roughly 11 of every 12 positive results are false. A positive screen calls for a confirmatory test, not a diagnosis.",
      },
      {
        title: "Simpson’s paradox in a treatment study",
        prompt:
          "Treatment A succeeds in 81 of 87 small cases and 192 of 263 large cases. Treatment B succeeds in 234 of 270 small cases and 55 of 80 large cases. Which is better?",
        steps: [
          "Small cases: A 93%, B 87%. A is better.",
          "Large cases: A 73%, B 69%. A is better.",
          "Overall: A 273 / 350 = 78%, B 289 / 350 = 83%. B looks better.",
          "A was given mostly to the harder large cases, which drags its overall rate down.",
        ],
        answer:
          "A is better within each group. Here case size affected which treatment was chosen, so it is a confounder, and the subgroup comparison is the fair one. This pattern appears in a well-known study of kidney stone treatments.",
      },
      {
        title: "Halving a small risk",
        prompt:
          "A drug lowers the five-year risk of a disease from 2 in 1000 to 1 in 1000. Express the result as relative risk reduction, absolute risk reduction, and NNT.",
        steps: [
          "RR = 0.001 / 0.002 = 0.5, so the relative risk reduction is 50%.",
          "ARR = 0.002 − 0.001 = 0.001, one tenth of a percentage point.",
          "NNT = 1 / 0.001 = 1000.",
        ],
        answer:
          "“Halves your risk” and “1000 people take it for five years to prevent one case” describe the same result. Weigh the second against the drug’s side effects and cost.",
      },
      {
        title: "The worst performers improve",
        prompt:
          "Test scores have mean 100 and standard deviation 15, and the correlation between two sittings is 0.6. A student scores 70. What do you expect next time, with no intervention?",
        steps: [
          "Distance from the mean: 70 − 100 = −30.",
          "Expected second distance: 0.6 × (−30) = −18.",
          "Expected score: 100 − 18 = 82.",
        ],
        answer:
          "About 82, an apparent improvement of 12 points with nothing done. A program for the lowest scorers must beat this, which takes a control group chosen the same way.",
      },
      {
        title: "Forking paths",
        prompt:
          "A researcher can split the data into 14 subgroups and reports any with p < 0.05. If there is no real effect anywhere, how often will they find something?",
        steps: [
          "Treat the 14 tests as independent, each with α = 0.05.",
          "P(none significant) = 0.95¹⁴ ≈ 0.488.",
          "P(at least one) ≈ 1 − 0.488 = 0.512.",
        ],
        answer:
          "About half the time. A single significant subgroup, reported without the others, is weak evidence.",
      },
    ],
    practice: [
      {
        q: "A magazine surveys its readers and finds 80% favor a policy. Why might this not describe the public?",
        a: "Selection bias: the magazine’s readers are not a random sample of the public, and those who reply are a further self-selected subset. The sampling, not the size, limits what the number means.",
      },
      {
        q: "Cities with more police have more crime. Does policing cause crime?",
        a: "Probably not directly. Cities with more crime hire more police, so the causation may run the other way, and city size confounds both. Observational correlation cannot settle direction.",
      },
      {
        q: "A headline says eating a food “raises cancer risk by 20%.” What two questions should you ask?",
        a: "What is the baseline risk, so you can find the absolute change? And what was compared with what: was this an experiment, or an observational study with possible confounding? A 20% relative increase on a 1% risk is 0.2 percentage points.",
      },
      {
        q: "Schools are rewarded for raising average test scores. Name two ways the number can improve without learning improving.",
        a: "Teaching narrowly to the test, and changing who takes the test, for example by discouraging weak students from sitting it. Both are Goodhart’s law: the measure became the target.",
      },
      {
        q: "Countries with higher chocolate consumption win more Nobel prizes per capita. Can you conclude that chocolate makes individuals smarter?",
        a: "No. That would be the ecological fallacy, reasoning from group-level data to individuals. Wealth is also a plausible confounder that drives both chocolate consumption and research funding.",
      },
    ],
    pitfalls: [
      "Trusting a large sample to fix bias. Precision and accuracy are different: a million biased responses still give a biased answer.",
      "Comparing groups that differ in ways other than the treatment, and attributing the whole difference to the treatment.",
      "Ignoring base rates when interpreting a test, an alarm, or a screening program.",
      "Crediting an intervention for an improvement that regression to the mean would have produced anyway.",
      "Reporting only the analyses that worked. Every outcome measured and every analysis tried belongs in the report.",
      "Quoting relative risk without absolute risk, or a percentage without the count behind it.",
      "Drawing conclusions about individuals from group-level data, or about one population from another.",
      "Reading a graph without checking its axes, its scale, and the time window chosen.",
    ],
  },
];
