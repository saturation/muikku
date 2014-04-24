package fi.muikku.plugins.search;

import java.util.Map;

public interface SearchProvider {
  public SearchResult search(Map<String, String> Query, int start, int lastResult, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int lastResult);
  public SearchResult matchAllSearch(int start, int lastResult);
  public void addToIndex(String typeName, Map<String, Object> entity);
  public void deleteFromIndex(String typeName, Map<String, Object> entity);
}
