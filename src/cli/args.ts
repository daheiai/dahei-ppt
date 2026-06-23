export function readOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

export function requireOption(args: string[], name: string): string {
  const value = readOption(args, name);

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing required option: ${name}`);
  }

  return value;
}
