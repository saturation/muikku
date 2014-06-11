package fi.muikku.plugins.mongolog;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

import fi.muikku.plugins.commonlog.LogProvider;

@ApplicationScoped
@Stateful
public class MongoLogProvider implements LogProvider {
  
  private static final String DB_NAME = "muikku"; //TODO: Make configurable
  private static final String DB_HOST = "localhost";
  private static final int DB_PORT = 27017;
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() throws UnknownHostException{
    mongo = new MongoClient( DB_HOST , DB_PORT );
    db = mongo.getDB(DB_NAME);
  }
  
  @Override
  public void log(String collection, Object data) {
    DBCollection c = db.getCollection(collection);
    try {
      String json = new ObjectMapper().writeValueAsString(data);
      DBObject o = (DBObject) JSON.parse(json);
      c.insert(o);
    } catch (IOException e) {
      logger.log(Level.WARNING, "Error while converting data to json");
    }
    
  }

  @Override
  public List<Object> getLogEntries(String collection, Map<String, Object> query, int count) {
    DBCollection c = db.getCollection(collection);
    BasicDBObject queryObject = new BasicDBObject();
    queryObject.putAll(query);
    DBCursor cursor = c.find(queryObject).sort(new BasicDBObject("_id", 1)).limit(count);
    ArrayList<Object> results = new ArrayList<Object>();
    results.addAll(cursor.toArray());
    return results;
  }
  
  @Override
  public String getName() {
    return "mongo-provider";
  }

  private MongoClient mongo;
  private DB db;
  
}
