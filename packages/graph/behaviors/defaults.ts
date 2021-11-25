import { combine, isUrlAbsolute, TimelinePipe } from "@pnp/core";
import { InjectHeaders, Queryable, RejectOnError, ResolveOnData, ThrowErrors } from "@pnp/queryable";
import { Telemetry } from "./telemetry.js";

export function DefaultInit(graphUrl = "https://graph.microsoft.com/v1.0"): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance.on.pre(async (url, init, result) => {

            init.cache = "default";
            init.credentials = "same-origin";

            if (!isUrlAbsolute(url)) {
                url = combine(graphUrl, url);
            }

            return [url, init, result];
        });

        instance.using(
            Telemetry(),
            RejectOnError(),
            ResolveOnData(),
            ThrowErrors());

        return instance;
    };
}

export function DefaultHeaders(): TimelinePipe<Queryable> {

    return (instance: Queryable) => {

        instance
            .using(InjectHeaders({
                "Content-Type": "application/json",
            }));

        return instance;
    };
}
