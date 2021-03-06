import { React } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Landing from './Landing/Landing';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Profile/Profile';
import MyGroups from './MyGroups/MyGroups';
import GroupPage from './GroupPage/GroupPage';
import InviteList from './InviteList/InviteList';
import CreateGroup from './CreateGroup/CreateGroup';

const Main = function () {
  return (
    <div>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/landing" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/mygroups" component={MyGroups} />
      <Route path="/groupPage" component={GroupPage} />
      <Route path="/inviteList" component={InviteList} />
      <Route path="/createGroup" component={CreateGroup} />
    </div>
  );
};

export default Main;
