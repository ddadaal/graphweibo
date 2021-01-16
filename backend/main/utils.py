from werkzeug.datastructures import ImmutableMultiDict


def get_page(args: ImmutableMultiDict) -> int:
    return int(args.get("page", 1))