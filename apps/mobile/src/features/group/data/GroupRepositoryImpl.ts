import type { AxiosInstance } from 'axios';
import type { Balances, Group, GroupDetail } from '../domain/entities/Group';
import type { GroupRepository } from '../domain/repositories/GroupRepository';

export class GroupRepositoryImpl implements GroupRepository {
  constructor(private readonly http: AxiosInstance) {}
  list() {
    return this.http.get<Group[]>('/groups').then((r) => r.data);
  }
  get(groupId: string) {
    return this.http.get<GroupDetail>(`/groups/${groupId}`).then((r) => r.data);
  }
  create(input: { name: string; memberIds: string[] }) {
    return this.http.post<Group>('/groups', input).then((r) => r.data);
  }
  addMemberByEmail(groupId: string, email: string) {
    return this.http.post<GroupDetail>(`/groups/${groupId}/members`, { email }).then((r) => r.data);
  }
  balances(groupId: string) {
    return this.http.get<Balances>(`/groups/${groupId}/balances`).then((r) => r.data);
  }
}
