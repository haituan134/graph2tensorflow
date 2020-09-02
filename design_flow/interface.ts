type activationType =
  | "elu"
  | "exponential"
  | "hard_sigmoid"
  | "linear"
  | "relu"
  | "selu"
  | "sigmoid"
  | "softmax"
  | "softplus"
  | "softsign"
  | "swish"
  | "tanh";
type dtypeTYpe = "float16" | "float32" | "float64";

class regularizer {
  static readonly l1 = new regularizer("L1", { l1: 0.009999999776482582 });
  static readonly l2 = new regularizer("L2", { l2: 0.009999999776482582 });
  static readonly l1_l2 = new regularizer("L1L2", {
    l1: 0.009999999776482582,
    l2: 0.009999999776482582,
  });

  private constructor(
    private readonly class_name: string,
    public readonly config: Record<string, any>,
  ) {}
}

class initializer {
  static readonly constant = new initializer("Constant", { value: 0 });
  static readonly glorot_normal = new initializer("GlorotNormal", { seed: null });
  static readonly glorot_uniform = new initializer("GlorotUniform", { seed: null });
  static readonly he_normal = new initializer("HeNormal", { seed: null });
  static readonly he_uniform = new initializer("HeUniform", { seed: null });
  static readonly identity = new initializer("Identity", { gain: 1.0 });
  static readonly lecun_normal = new initializer("LecunNormal", { seed: null });
  static readonly lecun_uniform = new initializer("LecunUniform", { seed: null });
  static readonly ones = new initializer("Ones", {});
  static readonly orthogonal = new initializer("Orthogonal", { gain: 1.0, seed: null });
  static readonly random_normal = new initializer("RandomNormal", {
    mean: 0.0,
    stddev: 0.05,
    seed: null,
  });
  static readonly random_uniform = new initializer("RandomUniform", {
    minval: -0.05,
    maxval: 0.05,
    seed: null,
  });
  static readonly truncated_normal = new initializer("TruncatedNormal", {
    mean: 0.0,
    stddev: 0.05,
    seed: null,
  });
  static readonly variance_scaling = new initializer("VarianceScaling", {
    scale: 1.0,
    mode: "fan_in",
    distribution: "truncated_normal",
    seed: null,
  });
  static readonly zeros = new initializer("Zeros", {});

  private constructor(
    private readonly class_name: string,
    public readonly config: Record<string, any>,
  ) {}
}

class constraint {
  static readonly max_norm = new constraint("MaxNorm", { max_value: 2, axis: 0 });
  static readonly min_max_norm = new constraint("MinMaxNorm", {
    min_value: 0.0,
    max_value: 1.0,
    rate: 1.0,
    axis: 0,
  });
  static readonly non_neg = new constraint("NonNeg", {});
  static readonly radial_constraint = new constraint("RadialConstraint", {});
  static readonly unit_norm = new constraint("UnitNorm", { axis: 0 });

  private constructor(
    private readonly class_name: string,
    public readonly config: Record<string, any>,
  ) {}
}

class Layer {
  class_name: string;
  config: Record<string, any>;
}

class Dense extends Layer {
  private static id = 0;

  config!: {
    trainable: boolean;
    dtype: dtypeTYpe;
    units: number;
    activation: activationType;
    use_bias: boolean;
    kernel_initializer: initializer;
    bias_initializer: initializer;
    kernel_regularizer: regularizer | null;
    bias_regularizer: regularizer | null;
    activity_regularizer: regularizer | null;
    kernel_constraint: constraint;
    bias_constraint: constraint | null;
    name: string;
  };

  constructor(units: number) {
    super();
    Dense.id += 1;
    this.class_name = "Dense";
    this.config["name"] = "Dense" + Dense.id.toString();

    this.config.units = units;
    this.config.trainable = true;
    this.config.dtype = "float32";
    this.config.activation = "linear";
    this.config.use_bias = true;
    this.config.kernel_initializer = initializer.glorot_uniform;
    this.config.bias_initializer = initializer.zeros;
    this.config.kernel_regularizer = null;
    this.config.bias_regularizer = null;
    this.config.activity_regularizer = null;
    this.config.kernel_constraint = constraint.max_norm;
    this.config.bias_constraint = null;
  }
}
