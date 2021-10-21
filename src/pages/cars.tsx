import { useState } from "react";
import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import useSWR from "swr";
import Search from ".";
import { CarModel } from "../../api/Car";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "../getAsString";
import deepEqual from "fast-deep-equal";
import { CarPagination } from "../components/CarPagination";
import { CarCard } from "../components/CarCard";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();
  const [serverQuery] = useState(query);

  // Caching method
  const { data } = useSWR("/api/cars?" + stringify(query), {
    // Say if we were on the page less than 15 seconds ago, do not do the call again
    dedupingInterval: 15000,

    // This indicate the initial data useSWR will receive, so he does not need to make the call
    // The deepEqual method compares the query in the browser and the query that was executed in the server
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12} style={{ marginTop: 22 }}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps<CarsListProps> = async (
  ctx
) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
