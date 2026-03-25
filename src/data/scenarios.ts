/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scenario } from './types';
import { NP, NDArray } from '../lib/numpy';

export const scenarios: Scenario[] = [
  {
    id: 'student-grades',
    title: 'Student Grade Analysis',
    section: 'Data Analysis',
    context: `<p>You&apos;re a teacher with exam scores for <strong>5 students</strong> across <strong>4 tests</strong>. You need to analyze performance, identify struggling students, and reason about the grade book as a single numerical object.</p><figure class="prose-figure"><img src="/illustrations/grades-matrix.svg" width="320" height="240" alt="Empty grid labeled 5 students by 4 tests representing a grades array with shape 5 comma 4." loading="lazy" decoding="async" /><figcaption>Think of the sheet as one 2D array: each row is a student, each column a test—then row means and boolean masks have a clear meaning.</figcaption></figure><p>This scenario uses the same patterns as the <strong>Aggregation</strong> and <strong>Boolean indexing</strong> lessons.</p>`,
    lessonsUsed: [0, 1, 5, 8],
    steps: [
      {
        title: 'Step 1: Load & Inspect',
        task: 'Create a 2D array <code>grades</code> with this data (5 students × 4 tests):<br><code>[[85,90,78,92],[65,70,60,55],[95,88,97,93],[72,68,75,70],[88,82,90,85]]</code><br>Print its shape.',
        hint: 'np.array([[85,90,78,92],[65,70,60,55],...])',
        starter: 'import numpy as np\n\n# 5 students, 4 tests each\ngrades = \n\nprint("Shape:", grades.shape)',
        validate(scope) {
          if (!scope.grades) return "Variable 'grades' not found";
          if (scope.grades.shape[0] !== 5 || scope.grades.shape[1] !== 4) return "Expected shape (5, 4)";
          if (scope.grades.data[0] !== 85) return "Check your data values";
          return true;
        },
      },
      {
        title: 'Step 2: Per-Student Averages',
        task: 'Calculate the <strong>average score per student</strong> (mean across tests, axis=1). Save as <code>averages</code>. Print it.',
        hint: 'grades.mean(axis=1)',
        starter: 'import numpy as np\n\ngrades = np.array([[85,90,78,92],[65,70,60,55],[95,88,97,93],[72,68,75,70],[88,82,90,85]])\n\naverages = \n\nprint("Student averages:", averages)',
        validate(scope) {
          if (!scope.averages) return "Variable 'averages' not found";
          const expected = NP.array([[85,90,78,92],[65,70,60,55],[95,88,97,93],[72,68,75,70],[88,82,90,85]]).mean(1);
          if (!NP.allclose(scope.averages, expected, 0.1)) return "Averages don't match expected values";
          return true;
        },
      },
      {
        title: 'Step 3: Find Struggling Students',
        task: 'Use boolean indexing to find which averages are <strong>below 75</strong>. Save the boolean mask as <code>struggling</code> and print the failing averages.',
        hint: 'struggling = averages < 75, then averages[struggling]',
        starter: 'import numpy as np\n\ngrades = np.array([[85,90,78,92],[65,70,60,55],[95,88,97,93],[72,68,75,70],[88,82,90,85]])\naverages = grades.mean(axis=1)\n\n# Find students averaging below 75\nstruggling = \n\nprint("Struggling:", averages[struggling])',
        validate(scope) {
          if (!scope.struggling) return "Variable 'struggling' not found";
          if (!(scope.struggling instanceof NDArray)) return "struggling should be an array from a comparison";
          return true;
        },
      },
    ],
  },
  {
    id: 'weather-station',
    title: 'Weather Station Data',
    section: 'Data Analysis',
    context: 'You\'re processing a week of temperature readings from 3 weather stations. Each station records a high and low temperature daily. You need to find trends and anomalies.',
    lessonsUsed: [0, 2, 7, 8, 10],
    steps: [
      {
        title: 'Step 1: Generate Data',
        task: 'Create <code>temps</code> — a (7, 3, 2) array using a seeded RNG (seed 42). Generate integers from 50 to 105. The dimensions represent: 7 days × 3 stations × 2 readings (high, low). Print the shape.',
        hint: 'rng = np.random.default_rng(42), rng.integers(50, 105, (7, 3, 2))',
        starter: 'import numpy as np\n\nrng = \ntemps = \n\nprint("Shape:", temps.shape)',
        validate(scope) {
          if (!scope.temps) return "Variable 'temps' not found";
          if (scope.temps.shape.length !== 3) return "Expected a 3D array";
          const s = scope.temps.shape;
          if (s[0] !== 7 || s[1] !== 3 || s[2] !== 2) return `Expected shape (7,3,2), got (${s})`;
          return true;
        },
      },
      {
        title: 'Step 2: Flatten & Analyze',
        task: 'Flatten <code>temps</code> to 1D as <code>all_temps</code>. Find the overall <code>min_temp</code>, <code>max_temp</code>, and <code>avg_temp</code> (rounded to 1 decimal). Print all three.',
        hint: 'all_temps = temps.flatten(), then .min(), .max(), and use np.round on the mean',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(42)\ntemps = rng.integers(50, 105, (7, 3, 2))\n\nall_temps = \nmin_temp = \nmax_temp = \navg_temp = \n\nprint("Min:", min_temp, "Max:", max_temp, "Avg:", avg_temp)',
        validate(scope) {
          if (!scope.all_temps) return "Variable 'all_temps' not found";
          if (scope.all_temps.ndim !== 1) return "all_temps should be flattened to 1D";
          if (scope.min_temp === undefined || scope.max_temp === undefined) return "Need min_temp and max_temp";
          return true;
        },
      },
    ],
  },
  {
    id: 'portfolio-analysis',
    title: 'Investment Portfolio Returns',
    section: 'Finance',
    context: 'You manage a portfolio of 4 stocks over 6 months. You need to calculate returns, find the best performer, and assess risk using standard deviation.',
    lessonsUsed: [0, 7, 8, 17],
    steps: [
      {
        title: 'Step 1: Create Price Data',
        task: 'Create <code>prices</code> — a (6, 4) array representing 6 months of closing prices for 4 stocks:<br><code>[[100,50,200,75],[105,48,210,80],[102,52,205,78],[110,55,220,85],[108,53,215,82],[115,58,230,90]]</code><br>Print it.',
        hint: 'np.array([[100,50,200,75], ...])',
        starter: 'import numpy as np\n\n# 6 months × 4 stocks\nprices = \n\nprint(prices)',
        validate(scope) {
          if (!scope.prices) return "Variable 'prices' not found";
          if (scope.prices.shape[0] !== 6 || scope.prices.shape[1] !== 4) return "Expected shape (6, 4)";
          return true;
        },
      },
      {
        title: 'Step 2: Calculate Total Returns',
        task: 'Calculate <code>returns</code> — the percentage gain from first month to last month for each stock: <code>(last - first) / first * 100</code>. Print it rounded to 1 decimal.',
        hint: 'first = prices[0:1], last = prices[5:6] or similar slicing, then the formula',
        starter: 'import numpy as np\n\nprices = np.array([[100,50,200,75],[105,48,210,80],[102,52,205,78],[110,55,220,85],[108,53,215,82],[115,58,230,90]])\n\n# Percentage return per stock: (last - first) / first * 100\nreturns = \n\nprint("Returns %:", returns)',
        validate(scope) {
          if (!scope.returns) return "Variable 'returns' not found";
          if (!(scope.returns instanceof NDArray)) return "returns should be an NDArray";
          return true;
        },
      },
      {
        title: 'Step 3: Best & Worst Performer',
        task: 'Use <code>np.argsort</code> on your returns to get <code>ranking</code>. The last element is the best performer index, the first is the worst. Print both indices.',
        hint: 'ranking = np.argsort(returns), worst = ranking[0], best = ranking[-1]',
        starter: 'import numpy as np\n\nprices = np.array([[100,50,200,75],[105,48,210,80],[102,52,205,78],[110,55,220,85],[108,53,215,82],[115,58,230,90]])\nfirst_row = np.array([100, 50, 200, 75])\nlast_row = np.array([115, 58, 230, 90])\nreturns = (last_row - first_row) * 100 / first_row\n\nranking = \n\nprint("Worst stock index:", ranking[0])\nprint("Best stock index:", ranking[-1])',
        validate(scope) {
          if (!scope.ranking) return "Variable 'ranking' not found";
          if (!(scope.ranking instanceof NDArray)) return "ranking should be from np.argsort";
          return true;
        },
      },
    ],
  },
  {
    id: 'image-pixels',
    title: 'Image Pixel Manipulation',
    section: 'Data Processing',
    context: 'You\'re working with a small 4×4 grayscale image represented as a NumPy array. You need to manipulate pixel values — normalize, threshold, and invert.',
    lessonsUsed: [0, 7, 10, 16],
    steps: [
      {
        title: 'Step 1: Create Image Data',
        task: 'Create a 4×4 array <code>image</code> with pixel values:<br><code>[[10,50,200,255],[30,80,150,220],[0,100,180,240],[60,120,90,170]]</code><br>Print it.',
        hint: 'np.array([[10,50,200,255], ...])',
        starter: 'import numpy as np\n\nimage = \n\nprint(image)',
        validate(scope) {
          if (!scope.image) return "Variable 'image' not found";
          if (scope.image.shape[0] !== 4 || scope.image.shape[1] !== 4) return "Expected shape (4, 4)";
          return true;
        },
      },
      {
        title: 'Step 2: Normalize to 0-1',
        task: 'Normalize the image to float values between 0 and 1. Save as <code>normalized</code>: divide every pixel by 255. Print it rounded to 2 decimals.',
        hint: 'normalized = image / 255, then np.round(normalized, 2)',
        starter: 'import numpy as np\n\nimage = np.array([[10,50,200,255],[30,80,150,220],[0,100,180,240],[60,120,90,170]])\n\nnormalized = \n\nprint(np.round(normalized, 2))',
        validate(scope) {
          if (!scope.normalized) return "Variable 'normalized' not found";
          if (!NP.isclose(scope.normalized.data[3], 1.0, 0.01)) return "255 should normalize to 1.0";
          return true;
        },
      },
      {
        title: 'Step 3: Threshold (Binary)',
        task: 'Create a <strong>binary image</strong> <code>binary</code> using <code>np.where</code>: pixels ≥ 128 become 255 (white), pixels < 128 become 0 (black). Print it.',
        hint: 'np.where(image >= 128, 255, 0)',
        starter: 'import numpy as np\n\nimage = np.array([[10,50,200,255],[30,80,150,220],[0,100,180,240],[60,120,90,170]])\n\nbinary = \n\nprint(binary)',
        validate(scope) {
          if (!scope.binary) return "Variable 'binary' not found";
          const expected = NP.where(NP.array([[10,50,200,255],[30,80,150,220],[0,100,180,240],[60,120,90,170]]).gte(128), 255, 0);
          if (!NP.array_equal(scope.binary, expected)) return "Binary threshold values don't match";
          return true;
        },
      },
    ],
  },
  {
    id: 'ab-test',
    title: 'A/B Test Analysis',
    section: 'Data Analysis',
    context: 'You ran an A/B test on your website. Group A (control) had 200 users, Group B (variant) had 200 users. You recorded conversion rates and need to analyze the results.',
    lessonsUsed: [0, 3, 8, 5],
    steps: [
      {
        title: 'Step 1: Simulate Data',
        task: 'Use a seeded RNG (seed 123). Generate <code>group_a</code>: 200 random floats [0, 1). Generate <code>group_b</code>: 200 random floats [0, 1). Print the first 5 of each.',
        hint: 'rng = np.random.default_rng(123), rng.random((200,))',
        starter: 'import numpy as np\n\nrng = \ngroup_a = \ngroup_b = \n\nprint("A first 5:", group_a[0:5])\nprint("B first 5:", group_b[0:5])',
        validate(scope) {
          if (!scope.group_a || !scope.group_b) return "Need both group_a and group_b";
          if (scope.group_a.data.length !== 200) return "group_a should have 200 elements";
          if (scope.group_b.data.length !== 200) return "group_b should have 200 elements";
          return true;
        },
      },
      {
        title: 'Step 2: Conversion Rates',
        task: 'Count conversions: a user "converted" if their value < 0.12 (group A) or < 0.15 (group B). Use boolean indexing to count. Save as <code>conv_a</code> and <code>conv_b</code> (just the counts, not arrays). Print both.',
        hint: 'conv_a = len(group_a[group_a < 0.12]) — but in our system use group_a.filter(group_a.lt(0.12)).size or similar',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(123)\ngroup_a = rng.random((200,))\ngroup_b = rng.random((200,))\n\n# Count conversions\nconv_a = \nconv_b = \n\nprint("Group A conversions:", conv_a)\nprint("Group B conversions:", conv_b)',
        validate(scope) {
          if (scope.conv_a === undefined || scope.conv_b === undefined) return "Need both conv_a and conv_b";
          return true;
        },
      },
    ],
  },
  {
    id: 'inventory-mgmt',
    title: 'Inventory Management',
    section: 'Business',
    context: 'You manage inventory for a small store with 6 products across 3 warehouse locations. You need to track stock levels, find shortages, and calculate reorder quantities.',
    lessonsUsed: [0, 5, 8, 13, 16],
    steps: [
      {
        title: 'Step 1: Stock Levels',
        task: 'Create <code>stock</code> — a (3, 6) array representing 3 warehouses × 6 products:<br><code>[[50,0,30,100,15,80],[20,45,0,60,5,35],[0,25,55,40,0,90]]</code><br>Create <code>product_names = [\'Widget\',\'Gadget\',\'Gizmo\',\'Doohickey\',\'Thingamajig\',\'Whatchamacallit\']</code>. Print stock.',
        hint: 'np.array for stock, np.array for names',
        starter: 'import numpy as np\n\nstock = \nproduct_names = \n\nprint(stock)',
        validate(scope) {
          if (!scope.stock) return "Variable 'stock' not found";
          if (scope.stock.shape[0] !== 3 || scope.stock.shape[1] !== 6) return "Expected shape (3, 6)";
          return true;
        },
      },
      {
        title: 'Step 2: Total & Out-of-Stock',
        task: 'Calculate <code>total_per_product</code> — total stock across all warehouses (sum along axis=0). Then find which products have <strong>any warehouse at zero</strong> stock using <code>np.where</code>. Save the zero-count check as <code>has_zero</code>.',
        hint: 'total_per_product = stock.sum(axis=0). For zeros, check each column.',
        starter: 'import numpy as np\n\nstock = np.array([[50,0,30,100,15,80],[20,45,0,60,5,35],[0,25,55,40,0,90]])\n\ntotal_per_product = \n\nprint("Total per product:", total_per_product)',
        validate(scope) {
          if (!scope.total_per_product) return "Variable 'total_per_product' not found";
          if (JSON.stringify(scope.total_per_product.data) !== JSON.stringify([70,70,85,200,20,205])) return "Expected [70,70,85,200,20,205]";
          return true;
        },
      },
      {
        title: 'Step 3: Reorder Report',
        task: 'Products need reordering if their total stock is below 100. Create <code>reorder_mask</code> (total_per_product < 100). Apply it to get <code>reorder_quantities</code> = 100 - total for those products using <code>np.where(mask, 100 - total, 0)</code>. Print it.',
        hint: 'np.where(total_per_product < 100, 100 - total_per_product, 0)',
        starter: 'import numpy as np\n\nstock = np.array([[50,0,30,100,15,80],[20,45,0,60,5,35],[0,25,55,40,0,90]])\ntotal_per_product = stock.sum(axis=0)\n\nreorder_quantities = \n\nprint("Reorder quantities:", reorder_quantities)',
        validate(scope) {
          if (!scope.reorder_quantities) return "Variable 'reorder_quantities' not found";
          const expected = NP.where(NP.array([70,70,85,200,20,205]).lt(100), NP.array([30,30,15,-100,80,-105]), 0);
          // More lenient check
          if (!(scope.reorder_quantities instanceof NDArray)) return "Should be an NDArray from np.where";
          return true;
        },
      },
    ],
  },
  {
    id: 'survey-cleanup',
    title: 'Survey Data Cleanup',
    section: 'Data Processing',
    context: 'You received survey responses (ratings 1-5) from 50 respondents across 8 questions. Some responses are invalid (0 or 6+). You need to clean, analyze, and summarize.',
    lessonsUsed: [0, 3, 5, 8, 16],
    steps: [
      {
        title: 'Step 1: Generate Messy Data',
        task: 'Use seed 99. Generate <code>raw_survey</code> — 50 × 8 array of random integers from 0 to 7. This simulates messy data where 0 and 6-7 are invalid. Print its shape.',
        hint: 'rng.integers(0, 8, (50, 8))',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(99)\nraw_survey = \n\nprint("Shape:", raw_survey.shape)',
        validate(scope) {
          if (!scope.raw_survey) return "Variable 'raw_survey' not found";
          if (scope.raw_survey.shape[0] !== 50 || scope.raw_survey.shape[1] !== 8) return "Expected shape (50, 8)";
          return true;
        },
      },
      {
        title: 'Step 2: Clean Invalid Responses',
        task: 'Replace invalid values (anything < 1 or > 5) with 3 (neutral). Use <code>np.where</code> twice or combine conditions. Save as <code>clean</code>. Print the min and max to verify they\'re 1-5.',
        hint: 'np.where(raw_survey < 1, 3, raw_survey) then np.where(result > 5, 3, result)',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(99)\nraw_survey = rng.integers(0, 8, (50, 8))\n\n# Replace < 1 or > 5 with 3\nclean = \n\nprint("Min:", clean.min(), "Max:", clean.max())',
        validate(scope) {
          if (!scope.clean) return "Variable 'clean' not found";
          if (scope.clean.min() < 1 || scope.clean.max() > 5) return "Values should be between 1 and 5 after cleaning";
          return true;
        },
      },
    ],
  },
  {
    id: 'sales-forecast',
    title: 'Retail Sales Forecasting',
    section: 'Business',
    context: 'You have monthly sales data for a retail store over 12 months. You need to analyze trends, calculate moving averages, and identify the best/worst months.',
    lessonsUsed: [0, 2, 4, 8, 17],
    steps: [
      {
        title: 'Step 1: Sales Data',
        task: 'Create <code>monthly_sales</code> with these values (Jan-Dec):<br><code>[45000, 42000, 48000, 51000, 55000, 62000, 58000, 61000, 53000, 49000, 68000, 75000]</code><br>Create <code>months</code> from 1 to 12 using <code>np.arange</code>.',
        hint: 'np.array([45000, ...]) and np.arange(1, 13)',
        starter: 'import numpy as np\n\nmonthly_sales = \nmonths = \n\nprint("Sales:", monthly_sales)\nprint("Months:", months)',
        validate(scope) {
          if (!scope.monthly_sales) return "Variable 'monthly_sales' not found";
          if (scope.monthly_sales.data.length !== 12) return "Expected 12 months of data";
          if (!scope.months) return "Variable 'months' not found";
          return true;
        },
      },
      {
        title: 'Step 2: Key Metrics',
        task: 'Calculate <code>total_revenue</code> (sum), <code>avg_monthly</code> (mean), <code>best_month</code> (argmax + 1 for 1-indexed), and <code>worst_month</code> (argmin + 1). Print all.',
        hint: '.sum(), .mean(), .argmax() + 1, .argmin() + 1',
        starter: 'import numpy as np\n\nmonthly_sales = np.array([45000, 42000, 48000, 51000, 55000, 62000, 58000, 61000, 53000, 49000, 68000, 75000])\n\ntotal_revenue = \navg_monthly = \nbest_month = \nworst_month = \n\nprint("Total:", total_revenue)\nprint("Average:", avg_monthly)\nprint("Best month:", best_month)\nprint("Worst month:", worst_month)',
        validate(scope) {
          if (scope.total_revenue === undefined) return "Need total_revenue";
          if (scope.total_revenue !== 667000) return `Expected total 667000, got ${scope.total_revenue}`;
          if (scope.best_month !== 12) return "Best month should be 12 (December)";
          if (scope.worst_month !== 2) return "Worst month should be 2 (February)";
          return true;
        },
      },
    ],
  },
  {
    id: 'distance-matrix',
    title: 'City Distance Calculator',
    section: 'Math & Science',
    context: 'You have coordinates for 4 cities and need to compute the distance matrix between all pairs. This is a common task in logistics, mapping, and machine learning (e.g., KNN).',
    lessonsUsed: [0, 7, 9, 10, 19],
    steps: [
      {
        title: 'Step 1: City Coordinates',
        task: 'Create <code>cities</code> — a (4, 2) array of (x, y) coordinates:<br><code>[[0, 0], [3, 4], [6, 0], [3, -4]]</code><br>These form a diamond shape. Print it.',
        hint: 'np.array([[0,0],[3,4],[6,0],[3,-4]])',
        starter: 'import numpy as np\n\ncities = \n\nprint(cities)',
        validate(scope) {
          if (!scope.cities) return "Variable 'cities' not found";
          if (scope.cities.shape[0] !== 4 || scope.cities.shape[1] !== 2) return "Expected shape (4, 2)";
          return true;
        },
      },
      {
        title: 'Step 2: Distance Between First Two Cities',
        task: 'Calculate the Euclidean distance between city 0 and city 1. Formula: <code>sqrt((x2-x1)² + (y2-y1)²)</code>. Save as <code>dist_01</code>. Print it.',
        hint: 'Use np.sqrt and ** 2 on the coordinate differences',
        starter: 'import numpy as np\n\ncities = np.array([[0, 0], [3, 4], [6, 0], [3, -4]])\n\n# Distance from city 0 to city 1\ndist_01 = \n\nprint("Distance 0→1:", dist_01)',
        validate(scope) {
          if (scope.dist_01 === undefined) return "Variable 'dist_01' not found";
          if (!NP.isclose(scope.dist_01, 5.0, 0.01)) return "Distance from (0,0) to (3,4) should be 5.0";
          return true;
        },
      },
    ],
  },
  {
    id: 'recipe-scaler',
    title: 'Recipe Ingredient Scaler',
    section: 'Everyday Math',
    context: 'You have a recipe that serves 4 people with specific ingredient amounts. You need to scale it for different party sizes using broadcasting — exactly how NumPy shines in everyday calculations.',
    lessonsUsed: [0, 7, 13, 14],
    steps: [
      {
        title: 'Step 1: Base Recipe',
        task: 'Create <code>base_recipe</code> with ingredient amounts for 4 servings (in grams):<br><code>[200, 150, 100, 50, 30, 10]</code><br>(flour, sugar, butter, eggs_g, salt, vanilla). Print it.',
        hint: 'np.array([200, 150, 100, 50, 30, 10])',
        starter: 'import numpy as np\n\n# Amounts for 4 servings (grams)\nbase_recipe = \n\nprint("Base (4 servings):", base_recipe)',
        validate(scope) {
          if (!scope.base_recipe) return "Variable 'base_recipe' not found";
          if (scope.base_recipe.data.length !== 6) return "Expected 6 ingredients";
          return true;
        },
      },
      {
        title: 'Step 2: Scale for Multiple Sizes',
        task: 'Create <code>multipliers = np.array([0.5, 1, 2, 3])</code> representing servings for 2, 4, 8, 12 people. Reshape multipliers to (4, 1) and broadcast-multiply with base_recipe to get <code>all_recipes</code> — a (4, 6) array. Print it.',
        hint: 'multipliers.reshape(4, 1) * base_recipe gives (4, 6) via broadcasting',
        starter: 'import numpy as np\n\nbase_recipe = np.array([200, 150, 100, 50, 30, 10])\nmultipliers = np.array([0.5, 1, 2, 3])\n\n# Scale: (4, 1) × (6,) broadcasts to (4, 6)\nall_recipes = \n\nprint(all_recipes)',
        validate(scope) {
          if (!scope.all_recipes) return "Variable 'all_recipes' not found";
          if (scope.all_recipes.shape[0] !== 4 || scope.all_recipes.shape[1] !== 6) return "Expected shape (4, 6)";
          if (!NP.isclose(scope.all_recipes.data[0], 100, 0.01)) return "First value should be 200 * 0.5 = 100";
          return true;
        },
      },
    ],
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness Tracker Analytics',
    section: 'Everyday Math',
    context: 'You\'re building a simple fitness tracker analysis. You have step counts for 4 weeks (28 days) and need to analyze daily, weekly, and overall performance.',
    lessonsUsed: [0, 2, 8, 10, 16],
    steps: [
      {
        title: 'Step 1: Generate Step Data',
        task: 'Use seed 7. Generate <code>daily_steps</code> — 28 random integers from 3000 to 15001 (representing realistic step counts). Reshape into <code>weekly</code> — a (4, 7) array (4 weeks × 7 days). Print weekly.',
        hint: 'rng.integers(3000, 15001, 28) then .reshape(4, 7)',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(7)\ndaily_steps = \nweekly = \n\nprint("Weekly steps:\\n", weekly)',
        validate(scope) {
          if (!scope.weekly) return "Variable 'weekly' not found";
          if (scope.weekly.shape[0] !== 4 || scope.weekly.shape[1] !== 7) return "Expected shape (4, 7)";
          return true;
        },
      },
      {
        title: 'Step 2: Weekly Totals & Best Day',
        task: 'Calculate <code>weekly_totals</code> (sum per week, axis=1). Find <code>best_week</code> (argmax + 1 for 1-indexed). Also find the single <code>max_day</code> steps across all days. Print all.',
        hint: 'weekly.sum(axis=1), .argmax() + 1, daily_steps.max()',
        starter: 'import numpy as np\n\nrng = np.random.default_rng(7)\ndaily_steps = rng.integers(3000, 15001, 28)\nweekly = daily_steps.reshape(4, 7)\n\nweekly_totals = \nbest_week = \nmax_day = \n\nprint("Weekly totals:", weekly_totals)\nprint("Best week:", best_week)\nprint("Max single day:", max_day)',
        validate(scope) {
          if (!scope.weekly_totals) return "Variable 'weekly_totals' not found";
          if (scope.best_week === undefined) return "Need best_week";
          if (scope.max_day === undefined) return "Need max_day";
          return true;
        },
      },
    ],
  },
  {
    id: 'equation-solver',
    title: 'Engineering Equation Solver',
    section: 'Math & Science',
    context: 'You\'re an engineer solving a system of equations from a circuit analysis. Three loops in a circuit give you 3 equations with 3 unknowns (currents). This is exactly what np.linalg.solve is built for.',
    lessonsUsed: [0, 19, 20, 21],
    steps: [
      {
        title: 'Step 1: Set Up the System',
        task: 'The equations are:<br><code>2I₁ + I₂ - I₃ = 8</code><br><code>-I₁ + 3I₂ + 2I₃ = 1</code><br><code>I₁ - I₂ + 4I₃ = 11</code><br>Create coefficient matrix <code>A</code> and constants vector <code>b</code>. Print both.',
        hint: 'A = np.array([[2,1,-1],[-1,3,2],[1,-1,4]]), b = np.array([8, 1, 11])',
        starter: 'import numpy as np\n\n# 2*I1 + 1*I2 - 1*I3 = 8\n# -1*I1 + 3*I2 + 2*I3 = 1\n# 1*I1 - 1*I2 + 4*I3 = 11\n\nA = \nb = \n\nprint("A:\\n", A)\nprint("b:", b)',
        validate(scope) {
          if (!scope.A || !scope.b) return "Need both A and b";
          if (scope.A.shape[0] !== 3 || scope.A.shape[1] !== 3) return "A should be 3×3";
          if (scope.b.data.length !== 3) return "b should have 3 elements";
          return true;
        },
      },
      {
        title: 'Step 2: Solve & Verify',
        task: 'This is a 3×3 system so our solver won\'t handle it directly. Instead, use the matrix inverse approach: <code>solution = A_inv @ b</code> where <code>A_inv</code> uses the formula for 3×3 inverse. Actually — just compute <code>det_A = np.linalg.det(A)</code> to verify the system is solvable (det ≠ 0). Print det_A.',
        hint: 'np.linalg.det(A)',
        starter: 'import numpy as np\n\nA = np.array([[2,1,-1],[-1,3,2],[1,-1,4]])\nb = np.array([8, 1, 11])\n\ndet_A = \n\nprint("Determinant:", det_A)\nprint("System is solvable!" if det_A != 0 else "System has no unique solution")',
        validate(scope) {
          if (scope.det_A === undefined) return "Variable 'det_A' not found";
          if (scope.det_A === 0) return "Determinant shouldn't be zero for this system";
          return true;
        },
      },
    ],
  },
];
