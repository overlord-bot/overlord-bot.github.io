from flask import Flask, request
from dependencies.course import Course
from dependencies.catalog import Catalog
from dependencies.degree import Degree
from dependencies.bundle import Bundle
from dependencies.rules import Rules
from dependencies.schedule import Schedule
from dependencies.test_suite import Test1
from dependencies.user import User
from dependencies.user import Flag

import os
import json

app = Flask(__name__)
#flask --app server run

class Degree_Planner():

    # each user is assigned a User object and stored in this dictionary
    # Users = <username, User>
    users = dict()

    # a single copy of the catalog is kept in this class
    catalog = Catalog()

    #-----------------------------------------------------------------------
    # Main message listener
    #
    # Generates a schedule for each user and then passes the message
    # content to a helper function which will read the message and
    # determine responses.
    #-----------------------------------------------------------------------
    async def on_message(self, message, mode):
        # self.users is a dictionary of existing users that link their name to a User object
        if message['author'] in self.users:
            print(f"returning user: {message['author']}")
            user = User(message['author'])
            user.flag.add(Flag.MENU_SELECT)
            return await self.message_handler(message, mode)
        else:
            user = User(message['author'])
            self.users.update({message['author']:user})
            print(f"new user: {message['author']}")
            user.flag.add(Flag.MENU_SELECT)
            return await self.message_handler(message, mode)

        print("on message function ended")

    #-----------------------------------------------------------------------
    # This function is a temporary text based system to control the bot
    # it can all be replaced with different UI system later
    #-----------------------------------------------------------------------
    async def message_handler(self, message, mode):
        user:User = self.users.get(message['author'])

        if Flag.TEST_RUNNING in user.flag:
            await user.msg(message, "Test running, please hold on")
            return

        if mode == "init":
            user.flag.clear()
            
            return {"response":(message, f"Hiyaa, what would you like to do, {str(message['author'])[0:str(message['author']).find('#'):1]}?")} # What would you like to do, <username without tag>?
            print(message, "input the number in chat:  1: begin test sequence 2: import courses from json file 9: run scheduler 0: cancel")

            # Sets the flag to true so the next input (except for "dp") is treated as a response to the selection
            
        user.flag.clear()

        # CASE 1: run test suite
        if mode == "1":
            print("INPUT 1 REGISTERED")
            user.flag.add(Flag.TEST_RUNNING)
            await self.test(message)
            await user.msg(message, "Test completed successfully, all assertions are met")
            user.flag.remove(Flag.TEST_RUNNING)

        await planner.load_catalog()

        # CASE 9: Begin actual scheduler
        if mode == "9":
            print("9")
            user.flag.add(Flag.SCHEDULING)
            #user.flag.add(Flag.SCHEDULE_SELECTION)
            #await user.msg(message, "You are now in scheduling mode!")
            #await user.msg(message, "Please enter the name of the schedule to modify. If the schedule entered does not exist, it will be created")

            #cmd = message['course']
            print(message)
            schedule = user.get_schedule(message['schedule'])
            if isinstance(schedule, str):
                print(schedule + " " + user.prints())
                print(f"Schedule {message['schedule']} not found, generating new one!")
                user.new_schedule(message['schedule'])
                user.curr_schedule = message['schedule']
            else:
                print(f"Successfully switched to schedule {message['schedule']}!")
                user.curr_schedule = message['schedule']
            #user.flag.remove(Flag.SCHEDULE_SELECTION)

            sche = user.get_schedule(user.curr_schedule)

            if message['mode'] == 'add':
                semester = int(message['semester'])
                if semester not in range(0, sche.SEMESTERS_MAX):
                    return self.res(res=["invalid semester, please enter number between 0 and 11"], crit_err=True, user=user)

                c = []
                err = False
                for course_name in message['courses']:
                    course = self.catalog.get_course(course_name)
                    if isinstance(course, str):
                        c.append(f"course {course_name} not found")
                        err = True
                        continue

                    sche.add_course(course, semester)
                    c.append(f"successfully added course {course_name} to semester {semester}")
                
                return self.res(res=c, error=err, user=user)
                    
            elif message['mode'] == "remove":
                if l < 3:
                    await user.msg(message, "not enough arguments")
                    return
                semester = int(message['semester'])
                if semester not in range(0, sche.SEMESTERS_MAX):
                    await user.msg(message, "invalid semester, please enter number between 0 and 11")
                    return

                for course_name in message['courses']:
                    course = self.catalog.get_course(course_name)
                    if isinstance(course, str) or course not in sche.get_semester(semester):
                        await user.msg(message, f"can't find course {course_name} in semester {semester}")
                        continue
                    sche.remove_course(course, semester)
                    await user.msg(message, f"successfully removed course {course_name} from semester {semester}")

            #elif cmd == "fulfillment":
            '''
            elif cmd == "reschedule":
                await user.msg(message, "Understood, please enter schedule name to modify:")
                user.flag.add(Flag.SCHEDULE_SELECTION)
            '''

    async def load_catalog(self):
        # CASE 2: run data fetch from json
        #elif mode == "2":
        print("INPUT 2 REGISTERED")
        # There are currently three acceptable places to store the course_data.json file, and this function
        # will check through them in the listed order:
        # 1) within a folder named "data" inside degree planner's directory
        # 2) degree planner's directory
        # 3) root directory of the project folder

        if os.path.isfile("./dependencies/data/course_data.json"):
            #await user.msg(message, f"file found: {os.getcwd()}/cogs/degree planner/data/course_data.json")
            f = open("./dependencies/data/course_data.json")
        elif os.path.isfile("./dependencies/degree planner/course_data.json"):
            #await user.msg(message, f"file found: {os.getcwd()}/cogs/degree planner/course_data.json")
            f = open("./dependencies/degree planner/course_data.json")
        elif os.path.isfile("./course_data.json"):
            #await user.msg(message, f"file found: {os.getcwd()}/course_data.json")
            f = open("./course_data.json")

        else:
            #return self.res(res=["file not found, terminating"], crit_err=True, user=user)
            print('file not found')
            return 
        json_data = json.load(f)
        f.close()
        await self.parse_courses(json_data)
        return

    async def print_catalog(self):
        await planner.load_catalog()
        return {
            'error': False,
            'response': self.catalog.to_string()
        }

    def res(self, **kwargs):
        if 'crit_err' in kwargs:
            return kwargs
        user = kwargs['user']
        sche = user.get_schedule(user.curr_schedule)
        return {
            'user': user.username,
            'semester': '',
            'schedule_num': user.curr_schedule,
            'schedule': sche.to_string(),
            'error': kwargs['error'] if 'error' in kwargs else None,
            'response': kwargs['res']
        }

    #-----------------------------------------------------------------------
    # Helper function that starts running the test_suite, can be replaced
    # by pytest later
    #-----------------------------------------------------------------------
    async def test(self, message):
        user = self.users.get(message['author'])
        test_suite = Test1()
        user.flag.add(Flag.DEBUG)
        await test_suite.test(message, user)
        user.flag.remove(Flag.DEBUG)   

    #-----------------------------------------------------------------------
    # Loads json file data representing course data into course objects
    # and stores it into the catalog
    #-----------------------------------------------------------------------
    async def parse_courses(self, json_data):
        
        #user = self.users.get(message.author)
        '''
        if Flag.TEST_RUNNING in user.flag:
            print("Operation unavailable due to another user operation running")
            return
        '''
        #await user.msg(message, "Beginning parsing json data into catalog")
        
        for element in json_data['courses']:

            # gets course name, major and course_id
            course = Course(element['name'], element['major'], int(element['id']))

            if 'credits' in element:
                course.credits = element['credits']
            
            if 'CI' in element:
                course.CI = element['CI']

            if 'HASS_pathway' in element:
                HASS_pathway = element['HASS_pathway'] # list of pathways
                if isinstance(HASS_pathway, list):
                    for pathway in HASS_pathway: # add each individual pathway (stripped of whitespace)
                        course.add_pathway(pathway.strip())
                elif HASS_pathway != "":
                    course.add_pathway(HASS_pathway.strip())

            if 'concentration' in element:
                concentration = element['concentration']
                if isinstance(concentration, list):
                    for con in concentration:
                        course.add_concentration(con.strip())
                elif concentration != "":
                    course.add_concentration(concentration.strip())

            if 'prerequisites' in element:
                prereqs = element['prerequisites']
                if isinstance(prereqs, list):
                    for prereq in prereqs:
                        course.add_prerequisite(prereq.strip())
                elif prereqs != "":
                    course.add_prerequisite(prereqs.strip())

            if 'cross_listed' in element:
                cross_listed = element['cross_listed']
                if isinstance(cross_listed, list):
                    for cross in cross_listed:
                        course.add_cross_listed(cross.strip())
                elif cross_listed != "":
                    course.add_cross_listed(cross_listed.strip())

            if 'restricted' in element:
                course.restricted = element['restricted']

            if 'description' in element:
                course.description = element['description']

            self.catalog.add_course(course)
            print(course.to_string())
        #await user.msg_release(message, False)

planner = Degree_Planner()

@app.route("/", methods = ['GET', 'POST'])
async def dp():
    if request.method == 'POST':
        print(request.json)
        return await planner.on_message(request.json, "init")
    if request.method == 'GET':
        return {
            "response": ""
        }

@app.route("/users/<string:user>/schedule/<string:schedule>", methods = ['GET', 'POST'])
async def dp_schedule(schedule, user):
    if request.method == 'POST':
        req = {
            'author': user,
            'schedule': schedule,
            'mode': 'add',
            'semester': request.json['semester'],
            'courses': request.json['courses']
        }
        print(req)
        return await planner.on_message(req, "9")
    if request.method == 'GET':
        pass

@app.route("/catalog/", methods = ['GET'])
async def dp_catalog():
    return await planner.print_catalog()

@app.route("/test", methods = ['GET', 'POST'])
async def dpt():
    if request.method == 'POST':
        print(request.json)
        return await planner.on_message(request.json, "init")