import { PaginationRenderItemParams } from "@material-ui/lab";
import { ParsedUrlQuery } from "querystring";
import { getAsString } from "../getAsString";
import { useRouter } from "next/router";

import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import Link from "next/link";

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();

  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
  return (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a {...props}></a>
    </Link>
  );
}
