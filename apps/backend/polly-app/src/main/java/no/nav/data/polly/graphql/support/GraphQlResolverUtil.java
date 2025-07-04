package no.nav.data.polly.graphql.support;

import graphql.execution.ExecutionStepInfo;
import lombok.experimental.UtilityClass;

@UtilityClass
public class GraphQlResolverUtil {

    public static <T> T getFilter(ExecutionStepInfo executionStepInfo) {
        var step = executionStepInfo;
        while (step.hasParent() && step.getArgument("filter") == null) {
            step = step.getParent();
        }
        return step.getArgument("filter");
    }
}
