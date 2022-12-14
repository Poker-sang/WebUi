class Path {
  static Home = '/home';
  static Train = '/Train';
  static Sequential = '/sequential';

  static LayerEdit(name?: string, index?: number) {
    return `${Path.Sequential}/edit/${name ?? ':name'}/${index ?? ':index'}`;
  }

  static SequentialEdit(name?: string) {
    return `${Path.Sequential}/edit/${name ?? ':name'}`;
  }

  static SequentialNew = `${Path.Sequential}/new`;
}

export default Path;
