import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import OrganizedTaskClass from "../classes/OrganizedTaskClass";
import UserClass from "../classes/UserClass";

const router = Router();

const organizedTaskObj = new OrganizedTaskClass();
const userObj = new UserClass();

router.post(
  "/add",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email, task } = req.body;
      const user = await userObj.getUserId(email);
      const organizedTask = await organizedTaskObj.organizeTask(task, user);
      const response = {
        result: "success",
        task: organizedTask,
      };
      res.send(response);
    }
  )
);

router.post(
  "/folders",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const user = await userObj.getUserId(email);
      const folders = await organizedTaskObj.getFolders(user);
      const response = {
        result: "success",
        folders,
      };
      res.send(response);
    }
  )
);

router.post(
  "/folders/:folder",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const user = await userObj.getUserId(email);
      const folderData = await organizedTaskObj.getFolderData(
        user,
        req.params.folder
      );
      const response = {
        result: "success",
        folderData,
      };
      res.send(response);
    }
  )
);

router.post(
  "/folders/:folder/:folderName",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email, folderId } = req.body;
      const user = await userObj.getUserId(email);
      const folderData = await organizedTaskObj.getFoldersOfFolder(
        user,
        req.params.folder,
        folderId
      );
      const response = {
        result: "success",
        folderData,
      };
      res.send(response);
    }
  )
);

router.post(
  "/folder/edit",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { folderData } = req.body;
      await organizedTaskObj.update(folderData);
      const response = {
        result: "success",
      };
      res.send(response);
    }
  )
);

router.post(
  "/folder/delete",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { folderData } = req.body;
      await organizedTaskObj.delete(folderData);
      const response = {
        result: "success",
      };
      res.send(response);
    }
  )
);

module.exports = router;
