package cn.com.inhand.oauth2.dao;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.oauth2.dto.ClientQueryBean;
import org.bson.types.ObjectId;

import java.util.List;

public interface ClientDAO {
	public Client getClient(ObjectId clientId);

	public Client getPublicClient(ObjectId clientId, ObjectId oId);

	public Client getPublicClient(ObjectId clientId);

	public Client getClient(ObjectId clientId, String clientSecret);

	public Client getClientByClass(ObjectId oid, String clazz);

	public List<Client> getClients(ClientQueryBean cqb, int verbose, int skip, int limit);

	public long getCount(ClientQueryBean cqb);

	public void createClient(Client client);

	public void deleteClientById(ObjectId id);

	public void updateClient(Client client);
}
