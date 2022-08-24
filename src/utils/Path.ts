class Path {
  static Home = "/";
  static Train = "/train";
  static Sequential = "/sequential";

  static LayerEdit(name?: string, index?: number) {
    return `/sequential/${name ?? ":name"}/${index ?? ":index"}`;
  }

  static SequentialEdit(name?: string) {
    return `/sequential/${name ?? ":name"}`;
  }
}

export default Path;
