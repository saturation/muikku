SET REFERENTIAL_INTEGRITY FALSE;
delete from forumarea where id = 1;
delete from workspaceforumarea where id = 1;
delete from forummessage where forumarea_id = 1;
delete from forumthread where id = 1;
delete from forumthreadreply where thread_id = 1;
SET REFERENTIAL_INTEGRITY TRUE;
