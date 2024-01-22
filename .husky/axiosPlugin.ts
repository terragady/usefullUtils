const extraAxiosErrorIntegration: IntegrationFn = () => ({
  name: 'extraAxiosErrorIntegration',
  setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  processEvent(event, hint) {
    if (
      !hint.originalException ||
      !(hint.originalException instanceof AxiosError)
    ) {
      return event;
    }

    const axiosError = hint.originalException;
    const correlationId = axiosError.config?.headers['x-correlation-id'] as
      | string
      | undefined;
    const url = axiosError.config?.url;
    const responseData = axiosError.response?.data as Record<string, unknown>;
    const normalizedResponseData = normalize(responseData, 5) as object;
    addNonEnumerableProperty(
      normalizedResponseData,
      '__sentry_skip_normalization__',
      true
    );

    const contexts: Contexts = {
      ...event.contexts,
    };
    contexts.AxiosError = {
      correlationId,
      url,
      responseData: normalizedResponseData,
    };

    const tags = {
      ...event.tags,
    };
    tags.correlationId = correlationId;
    tags.reqUrl = url;

    return {
      ...event,
      contexts,
      tags,
    };
  },
});
